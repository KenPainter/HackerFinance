import * as fs from 'fs'
import * as path from 'path'

import { AccountMap, Inputs } from "./common/schema"
import { log, logBadNews, logGroup, logGroupEnd } from "./common/log"
import { loadChartOfAccounts } from "./dataLayer/chartOfAccounts"
import { Files } from './common/Files'

import { appendTransactionMap, loadTransactionMap, replaceTransactionMap } from "./dataLayer/transactionMap"
import { Statement } from "./Statement"


const FILES = new Files()
FILES.init()

export function close() {
    const msgClose = "Moving complete transactions from open set to closed set"
    logGroup(msgClose)

    // load chart of accounts and open transactions
    const accountMap:AccountMap = loadChartOfAccounts()
    const inputs:Inputs = loadTransactionMap(FILES.pathOpen())
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
    appendTransactionMap(FILES.pathClosed(),inputsMove)
    replaceTransactionMap(FILES.pathOpen(),inputsNoMove)
    logGroupEnd(msgMove)

    const msgStatements = "Running Statements on closed transactions"
    const closed = loadTransactionMap(FILES.pathClosed())
    logGroup(msgStatements)
    const statement = new Statement()
    statement.runEverything(FILES.pathStmClosed(),accountMap,closed)
    logGroupEnd(msgStatements)

    writeFull(accountMap)

    logGroupEnd(msgClose)
}

function writeFull(accountMap:AccountMap) {
    const msgFull = "Writing fully-specified transaction map"
    logGroup(msgFull)

    const inputs = loadTransactionMap(FILES.pathClosed())

    const full = inputs.map(trx=>{
        return {
            date: trx.date,
            debGroup: accountMap[trx.debAccount].group,
            debSubgroup: accountMap[trx.debAccount].subgroup,
            debAccount: trx.debAccount,
            debAmount: trx.amount,
            crdGroup: accountMap[trx.crdAccount].group,
            crdSubGroup: accountMap[trx.crdAccount].subgroup,
            crdAccount: trx.crdAccount,
            description: trx.description,
            srcFile: trx.srcFile
        }
    }) 

    const fileSpec = path.join(FILES.pathClosed(),"fully-mapped-transactions.csv")
    const header=Object.keys(full[0]).join(',')
    const lines = full.map(trx=>Object.values(trx).join(','))

    fs.writeFileSync(fileSpec,header + '\n' + lines.join('\n'))

    logGroupEnd(msgFull)
}