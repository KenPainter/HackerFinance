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
import { logBadNews, logConclusion, logTitle } from './src/common/log'
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
    .map(trx=>{
        if(trx.date>maxDate) {
            maxDate = trx.date
        }
        return trx
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

const accountsMap = loadChartOfAccounts()
interface BudgetItem {
    debGroup: string 
    debSubgroup: string
    debAccount: string
    debTotal:number 
}

const balances:Array<BudgetItem> = budget   
    .filter(trx=>trx.date.slice(0,4)==prevYear)
    .map(trx=>{
        const a = accountsMap[trx.debAccount]
        const x:BudgetItem = {
            debGroup: a[0],
            debSubgroup: a[1],
            debAccount: trx.debAccount,
            debTotal: parseFloat(trx.amount)
        } 
        return x
    })
    .sort((a,b)=>{
        if(a.debGroup > b.debGroup) return -1
        if(a.debGroup < b.debGroup) return 1
        if(Math.abs(a.debTotal) < Math.abs(b.debTotal)) return 1
        return -1
    })

jsonToCSV(balances)
logTitle("PROCESS COMPLETE: Create a new budget")

function jsonToCSV(items:Array<BudgetItem>) {
    const header = Object.keys(items[0]).join(',') + '\n'
    const text = items.map(item=>Object.values(item).join(','))
    fs.writeFileSync(pathBudgetFile,header + text.join('\n'))
}

