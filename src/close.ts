import * as fs from 'fs'
import * as path from 'path'

import { AccountMap, Inputs } from "./schema"
import { config } from './config'

import { loadChartOfAccounts } from "./chartOfAccounts"
import { log, logBadNews, logGroup, logGroupEnd } from "./common/log"
import { appendTransactionMap, loadTransactionMap, replaceTransactionMap } from "./transactionMap"
import { tabulate } from "./tabulate"
import { Statement } from "./Statement"

export function close() {
    const msgClose = "Moving complete transactions from open set to closed set"
    logGroup(msgClose)

    // load chart of accounts and open transactions
    const accountMap:AccountMap = loadChartOfAccounts()
    const inputs:Inputs = loadTransactionMap()
    const [ inputsNoMove, inputsMove ] = inputs.reduce((acc,trx)=>{
        if(!(trx.crdAccount in accountMap) || !(trx.debAccount in accountMap)) {
            acc[0].push(trx)
            return acc
        }
        acc[1].push(trx)
        return acc
    },[[],[]])

    if(inputsMove.length===0) {
        logBadNews("There are no complete transactions ready to close")
        logGroupEnd(msgClose)
        return;
    }

    // If still here, there are transactions to move
    const msgMove = "Moving transactions"
    logGroup(msgMove)
    log("There are ",inputsMove.length,"transactions ready to move")
    appendTransactionMap(inputsMove,true)
    replaceTransactionMap(inputsNoMove)
    logGroupEnd(msgMove)

    const msgStatements = "Running Statements on closed transactions"
    logGroup(msgStatements)
    const closed = loadTransactionMap(true)
    const [ aTallies, accountsFlat ] = tabulate(accountMap,closed)
    const statementOpen =  new Statement(aTallies,accountsFlat)
    statementOpen.runEverything(false,config.PATH_OPEN_REPORTS)
    logGroupEnd(msgStatements)

    writeFull(closed,accountMap)

    logGroupEnd(msgClose)
}

function writeFull(inputs:Inputs,accountMap:AccountMap) {
    const msgFull = "Writing fully-specified transaction map"
    logGroup(msgFull)

    const full = inputs.map(trx=>{
        return {
            date: trx.date,
            debGroup: accountMap[trx.debAccount][0],
            debSubgroup: accountMap[trx.debAccount][1],
            debAccount: trx.debAccount,
            debAmount: trx.amount,
            crdGroup: accountMap[trx.crdAccount][0],
            crdSubGroup: accountMap[trx.crdAccount][1],
            crdAccount: trx.crdAccount,
            description: trx.description,
            srcFile: trx.srcFile
        }
    }) 

    const fileSpec = path.join(config.PATH_CLOSED_REPORTS,"fully-mapped-transactions.csv")
    const header=Object.keys(full[0]).join(',')
    const lines = full.map(trx=>Object.values(trx).join(','))

    fs.writeFileSync(fileSpec,header + '\n' + lines.join('\n'))

    logGroupEnd(msgFull)
}