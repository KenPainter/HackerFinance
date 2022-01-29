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
import { fstat } from 'fs'
import { loadChartOfAccounts } from './src/chartOfAccounts'
import { logBadNews, logConclusion, logTitle } from './src/log'
import { InputTransaction } from './src/schema'
import { loadTransactionMap } from './src/transactionMap'

logTitle("PROCESS BEGIN: Create a new budget")

const stopNow = () => logTitle("PROCESS COMPLETE: Create a new budget")

// Expect one parameter as a year
const args = process.argv
if(args.length!==3) {
    logBadNews("I need exactly one parameter that names a year")
    stopNow()
}

const arg = args.pop()
const year = arg.replace(/[^0-9]/g,'')
if(year.length!==4 || arg!==year) {
    logBadNews("I need exactly one parameter that names a year")
    stopNow()
}

logConclusion("Making a budget based on year",year)

class BudgetItem {
    trxCount: number = 0
    debTotal: number = 0
    debAvg: number = 0
    debMin: number = 0
    debMax: number = 0
    constructor(
        public group:string,
        public subgroup:string,
        public account: string
    ) {}
}

const accountsMap = loadChartOfAccounts()

// If still here, we got a 4 year numeric value so load
// the closed transactions and compile the balance
// for all accounts in that year
const balances:{[key:string]:BudgetItem} = loadTransactionMap(true)
    .filter(trx=>trx.date.slice(0,4)===year)
    .reduce((acc,trx)=>{
        if(!(trx.crdAccount in acc)) {
            const a = accountsMap[trx.crdAccount]
            acc[trx.crdAccount] = new BudgetItem(a[0],a[1],a[2])
        }
        if(!(trx.debAccount in acc)) {
            const a = accountsMap[trx.debAccount]
            acc[trx.debAccount] = new BudgetItem(a[0],a[1],a[2])
        }
        const deb = acc[trx.debAccount]
        const crd = acc[trx.crdAccount]
        updateNums(deb,trx)
        updateNums(crd,trx)
        return acc
    },{})

const fixed:Array<BudgetItem> = Object.values(balances).map(item=>{item.debTotal=item.debTotal/100; return item})

jsonToCSV(fixed)

function jsonToCSV(items:Array<BudgetItem>) {
    const header = Object.keys(items[0]).join(',') + '\n'
    const text = items.map(item=>Object.values(item).join(','))
    fs.writeFileSync('budget.csv',header + text.join('\n'))
}

function updateNums(bi:BudgetItem,trx:InputTransaction) {
    const amount = Math.round(parseFloat(trx.amount)*100)
    bi.trxCount++
    bi.debTotal += amount
    bi.debAvg = Math.round((bi.debTotal / bi.trxCount)*100)/100
    if(bi.debMin===0 || Math.abs(amount) < bi.debMin) {
        bi.debMin = Math.abs(amount)
    }
    if(Math.abs(amount) > bi.debMax) {
        bi.debMax = Math.abs(amount)
    }
}