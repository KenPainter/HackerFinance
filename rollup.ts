/**
 * Rollup
 * This program is part of Hacker Finance
 * 
 * Roll up all income and expense accounts and generate
 * a manual input that reverses them
 */

import * as fs from 'fs'
import * as path from 'path'
import { logTitle, logDetail } from './src/log';
import { loadChartOfAccounts } from "./src/chartOfAccounts";
import { Account } from "./src/schema";
import { loadTransactionMap } from "./src/transactionMap";
import { config } from './src/config'

logTitle("PROCESS BEGIN: Year end rollup")

// do this as fixed constant for now
const date = '20211231'

let trxs = loadTransactionMap(true)
let accountMap = loadChartOfAccounts()

// load closed transactions
const groups = [ 'Income', 'Expense']
const totals:{[key:string]:number} = {}
for(const trx of trxs) {
    // Note we reverse everything, so -Debits, +Credits
    if(groups.includes(accountMap[trx.debAccount][0])) {
        doOne(trx.debAccount,-Math.round(parseFloat(trx.amount)*100))
    }
    if(groups.includes(accountMap[trx.crdAccount][0])) {
        doOne(trx.crdAccount,Math.round(parseFloat(trx.amount)*100))
    }
}
for(const acc in totals) {
    totals[acc]=totals[acc]/100
}

logDetail("Writing out a manual input")
const year = date.slice(0,4)
const newDate = date.slice(0,6)+"99"
const fileSpec = path.join(config.PATH_INPUTS,"manual-rollup-"+year+".csv")
const text = Object.keys(totals)
    .map(account=>`Rollups,${account},${newDate},${totals[account]},Year End Rollup ${year},`)
fs.writeFileSync(fileSpec,
    "Credit Account,Debit Account,Date,Amount,Description,Source\n" +
    text.join("\n")
)

function doOne(acc:Account,amt:number) {
    if(!(acc in totals)) {
        totals[acc] = 0
    }
    totals[acc]+=amt
}

logTitle("PROCESS END: Year end rollup")