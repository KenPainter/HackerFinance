import * as fs from 'fs'
import * as path from 'path'

import { log, logGroup, logGroupEnd, logBadNews } from '../common/log'
import { BudgetMap } from '../common/schema'
import { Files } from '../common/Files'

import { loadTransactionMap } from './transactionMap'
import { loadChartOfAccounts } from './chartOfAccounts'

const FILES = new Files()
FILES.init()

export function loadLatestBudget():BudgetMap {
    const candidates =fs.readdirSync(FILES.pathMasters())
        .filter(fileName=>fileName.startsWith('budget-'))
    if(candidates.length===0) {
        return {}
    }

    const fileName = candidates.sort().pop()
    log("Found budget ",fileName)
    const fileSpec = path.join(FILES.pathMasters(),fileName)
    const budgetItems = fs.readFileSync(fileSpec,'utf8')
        .split('\n')
        .slice(1)
        .filter(line=>line.trim().length!==0)
        .filter(line=>!line.trim().startsWith('//'))
        .map(line=>line.split(','))
        .map(line=>line.slice(-2))

    // Sometimes Typescript seems to need this by itself, not at end of chain
    const returnValue:BudgetMap = {}
    budgetItems.forEach(line=>returnValue[line[0]] = line[1].trim())
    return returnValue
}

export function makeBudget() {
    const msg = "Create a new budget"
    logGroup(msg)

    // load closed transactions, filter for rollups,
    // scan to get max rollup date 
    let maxDate = ''
    const closedTrx = loadTransactionMap(FILES.pathClosed())
    const budgetSourcesAll = closedTrx
        .filter(trx=>trx.date.slice(-2)=='99')
        .map(trx=>{
            if(trx.date>maxDate) {
                maxDate = trx.date
            }
            return trx
        })

    if(budgetSourcesAll.length===0) {
        logBadNews("There have been no rollups, nothing to create a budget from")
        logGroupEnd(msg)
        return 
    }

    // skip ahead one year from most recent rollup
    const prevYear = maxDate.slice(0,4)
    const year = (parseInt(prevYear)+1).toString()

    const pathBudgetFile = path.join(FILES.pathMasters(),`budget-${year}.csv`)
    if(fs.existsSync(pathBudgetFile)) {
        logBadNews(`Budget file already exists: ${pathBudgetFile}`)
        logGroupEnd(msg)
        return
    }

    log("Making a budget based on year",year)


    const accountsMap = loadChartOfAccounts()
    interface BudgetItem {
        debGroup: string 
        debSubgroup: string
        debAccount: string
        debTotal: string
    }

    const budgetSource = budgetSourcesAll.filter(trx=>trx.date==prevYear+'1299')
    const budget:Array<BudgetItem> = budgetSource
        .map(trx=>{
            const a = accountsMap[trx.debAccount]
            const x:BudgetItem = {
                debGroup: a.group,
                debSubgroup: a.subgroup,
                debAccount: trx.debAccount,
                debTotal: trx.amount
            } 
            return x
        })
        .sort((a,b)=>{
            if(a.debGroup > b.debGroup) return -1
            if(a.debGroup < b.debGroup) return 1
            if(Math.abs(parseFloat(a.debTotal)) < Math.abs(parseFloat(b.debTotal))) return 1
            return -1
        })

    // Write it out
    const header = 'Debit Group,Debit Subgroup,Debit Account,Debit Budget\n'
    const text = budget.map(item=>Object.values(item).join(','))
    fs.writeFileSync(pathBudgetFile,header + text.join('\n'))

    logGroupEnd(msg)
}