/**
 * make-budget
 * This program is part of Hacker Finance
 * 
 * not ready to use, just some draft code.  Rather than
 * keep working on this, it's better to write the budget
 * comparison tool with an already created budget, and
 * then come back and figure out how to generate that budget.
 */
import * as fs from 'fs'
import * as path from 'path'

import { config } from './src/config'
import { logBadNews, logConclusion, logTitle } from './src/log'
import { AccountMap } from './src/schema'

import { loadChartOfAccounts } from './src/chartOfAccounts'
import { loadTransactionMap } from './src/transactionMap'

logTitle("PROCESS BEGIN: Create a new budget")

// load closed transactions, filter for rollups,
// scan to get max rollup date 
let maxDate = ''
const closedTrx = loadTransactionMap(true)
const budget = closedTrx
    .filter(trx=>trx.date.slice(-2)=='99')
    .forEach(trx=>{
        if(trx.date>maxDate) {
            maxDate = trx.date
        }
    })

// skip ahead one year from most recent rollup
const prevYear = maxDate.slice(0,4)
const year = (parseInt(prevYear)+1).toString()

const pathBudgetFile = path.join(config.PATH_MASTERS,`budget-${year}.csv`)
if(fs.existsSync(pathBudgetFile)) {
    logBadNews("Budget file already exists: ",pathBudgetFile)
    process.exit()
}

logConclusion("Making a budget based on year",year)

class BudgetItem {
    debAccount: string = ''
    debTotal:number = 0
    trxCount:number = 0
    constructor(
        debAccount: string
    ) { this.debAccount = debAccount}
}

const accounts:AccountMap = loadChartOfAccounts()

const balances:{[key:string]:BudgetItem} = 
    closedTrx
        .filter(trx=>trx.date.slice(0,4)===prevYear && trx.date.slice(-2)!=='99')
        .filter(trx=>['Income','Expense'].includes(accounts[trx.debAccount][0]) ||
                     ['Income','Expense'].includes(accounts[trx.crdAccount][0]))
        .reduce((acc,trx)=>{
            if(!(trx.crdAccount in acc)) {
                acc[trx.crdAccount] = new BudgetItem(trx.crdAccount)
            }
            if(!(trx.debAccount in acc)) {
                acc[trx.debAccount] = new BudgetItem(trx.debAccount)
            }
            const a:BudgetItem = acc[trx.debAccount]
            a.trxCount++
            a.debTotal+=Math.round(parseFloat(trx.amount)*100) 
            const b:BudgetItem = acc[trx.crdAccount]
            b.trxCount++
            b.debTotal-=Math.round(parseFloat(trx.amount)*100) 
            return acc
        },{})


const fixed:Array<BudgetItem> = Object.values(balances)
    .map(item=>{item.debTotal=item.debTotal/100; return item})
    .sort((a,b)=>Math.abs(a.debTotal) > Math.abs(b.debTotal) ? 1 : -1)

jsonToCSV(fixed)
logTitle("PROCESS COMPLETE: Create a new budget")

function jsonToCSV(items:Array<BudgetItem>) {
    const header = Object.keys(items[0]).join(',') + '\n'
    const text = items.map(item=>Object.values(item).join(','))
    fs.writeFileSync(pathBudgetFile,header + text.join('\n'))
}

