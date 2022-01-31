/**
 * clear.ts
 * This program is part of Hacker Finance
 * 
 * Clears all mapped transactions in open batch
 * 
 * Version 1.0 complete 2022-01-25
 */
import { loadTransactionMap, replaceTransactionMap } from "./src/transactionMap";
import { Inputs } from './src/schema'

import { logBadNews, logConclusion, logDetail, logTitle } from './src/common/log'
import { formatCurrency } from "./src/Report1992";

logTitle("PROCESS BEGIN: Clear credit account on all trx in open batch")

let flagGo = false
const args = process.argv
args.shift()
args.shift()
while(args.length > 0) {
    const arg = args.pop()
    if(arg!=='go') {
        logBadNews("I only understand one option: 'go'")
    }
    else {
        flagGo = true
    }
}
if(flagGo) {
    logConclusion("parameter 'go' received, transactions will be cleared")
}
else {
    logConclusion("parameter 'go' not received, will report but take no action")
}

const trxs:Inputs = loadTransactionMap()

// first comes reports
let trxInfo:{[key:string]:[number,number]} = {}
trxs.filter(trx=>trx.crdAccount!=='').forEach(trx=>{
    const key = trx.debAccount + ' -> ' + trx.crdAccount
    if(!(key in trxInfo)) {
        trxInfo[key] = [0,0]
    }
    trxInfo[key][0]++
    trxInfo[key][1]+= parseFloat(trx.amount)
})
const anythingToDo = Object.keys(trxInfo).length > 0 
if(anythingToDo) {
    logConclusion("These are the debit -> credit mappings")
    Object.keys(trxInfo).forEach(key=>{
        logDetail(key,"for",trxInfo[key][0],"transactions summing to",formatCurrency(trxInfo[key][1]))
    })
}
else {
    logConclusion("No mapped transactions found")
}

// if "go" code was received
if(flagGo) {
    if(!anythingToDo) {
        logConclusion("Received the 'go' parameter but there are no mapped transactions")
    }
    else {
        trxs.forEach(trx=>{
            trx.crdAccount = ''
        })
        logConclusion("All credit account mappings have been cleared in the open batch")
        replaceTransactionMap(trxs)
    }
}

logTitle("PROCESS COMPLETE: Clear credit account on all trx in open batch")