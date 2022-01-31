/**
 * Rollup
 * This program is part of Hacker Finance
 * 
 * Roll up all income and expense accounts and generate
 * a manual input that reverses them
 */

import { Account } from "./src/common/schema";
import { Files } from './src/common/Files'
import { groups } from './src/common/groups'

import { loadChartOfAccounts } from "./src/dataLayer/chartOfAccounts";
import { loadTransactionMap } from "./src/dataLayer/transactionMap";

import { makeManualInput } from './src/dataLayer/manualInput';

const FILES = new Files()
FILES.init()

// do this as fixed constant for now
const date = '20211231'

let trxs = loadTransactionMap(FILES.pathClosed())
let accountMap = loadChartOfAccounts()

function doOne(acc:Account,amt:number) {
    if(!(acc in totals)) {
        totals[acc] = 0
    }
    totals[acc]+=amt
}

//
// ----------------- begin processing -----------------
//

// load closed transactions.  Note that we multiply by 100
// during the tally to prevent floating point silliness, then
// divide again at the end
const totals:{[key:string]:number} = {}
for(const trx of trxs) {
    // Note we reverse everything, so -Debits, +Credits
    if(groups.is.includes(accountMap[trx.debAccount].group)) {
        doOne(trx.debAccount,-Math.round(parseFloat(trx.amount)*100))
    }
    if(groups.is.includes(accountMap[trx.crdAccount].group)) {
        doOne(trx.crdAccount,Math.round(parseFloat(trx.amount)*100))
    }
}
for(const acc in totals) {
    totals[acc]=totals[acc]/100
}

const year = date.slice(0,4)
const newDate = date.slice(0,6)+"99"
const rollups = Object.entries(totals).map(entry=>{
    const account:string = entry[0]
    const total:number = entry[1]
    return [ 'Rollups', account, newDate, total.toString(), `Year End Rollup ${year}`,'' ]
})
makeManualInput(rollups,'manual-rollup-'+year)

