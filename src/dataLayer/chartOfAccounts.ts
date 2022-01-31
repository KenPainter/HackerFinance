import * as fs from 'fs'
import * as path from 'path'

import { AccountMap, BudgetMap  } from '../common/schema'
import { log } from '../common/log'
import { Files} from '../common/Files'
import { groups } from '../common/groups'

import { loadLatestBudget } from './budget';

const FILES = new Files()
FILES.init()
const FILE_NAME_COA = path.join(FILES.pathMasters(),"chart-of-accounts.csv")

const text_COA = `Group,Subgroup,Account
Equity,Exchange,Transfers
Equity,Exchange,Payments
Equity,Exchange,Splits
Equity,Retained,BeginBalances
Equity,Retained,Rollups`

export function loadChartOfAccounts():AccountMap {
    log("Loading chart of accounts",FILE_NAME_COA)
    log("Adding budget if available")
    const budgetMap:BudgetMap = loadLatestBudget()
    const getBudget = (a:string):string => a in budgetMap ? budgetMap[a] : '0'

    if(!fs.existsSync(FILE_NAME_COA)) {
        log('Chart of accounts does not exist, initializing with built-in accounts')
        fs.writeFileSync(FILE_NAME_COA,text_COA)
    }

    let accountMap:AccountMap = {}
    fs.readFileSync(FILE_NAME_COA,'utf8')
        .split('\n')
        .slice(1)
        .filter(line=>line.length>0)
        .map(line=>line.split(','))
        .filter(line=>{
            if(line.length !== 3) {
                log(`Line does not have 3 fields, it was dropped: ${line}`)
                return false
            }
            if(line[2]==='') {
                log(`Line has no account (3rd field), it was dropped: ${line}`)
                return false
            }
            if(line[0].trim().length===0 || line[1].trim().length===0) {
                log(`Line "${line.join(',')}" was dropped, Group or Subgroup missing`)
                return false
            }
            if(!groups.tb.includes(line[0].trim())) {
                log(`Line "${line.join(',')}" was dropped, it must have Group (first field) be one of [${groups.tb.join(', ')}]`)
                return false
            }
            return true
        })
        .forEach(line=>{
            accountMap[line[2]] = { 
                group:line[0].trim(),
                subgroup: line[1].trim(),
                account: line[2].trim(),
                budget: getBudget(line[2].trim())
            }
        })

    // Now add budget items that are not in the chart (which are a mistake but we are forgiving)
    for(const a of Object.keys(budgetMap)) {
        if(!(a in accountMap)) {
            accountMap[a] = {
                group: 'Expense',
                subgroup: '*BUDGET*',
                account: a,
                budget: getBudget(a)
            }
        }
    }
    return accountMap
}

export function writeChartOfAccounts(chart:AccountMap,newAccounts:Array<string>) {
    const header = 'Group,Subgroup,Account\n'
    const newlines = newAccounts.map(act=>`,,${act}`)
    const oldAccounts = Object.values(chart)
        .map(line=>[line.group,line.subgroup,line.account])
        .sort((a,b)=>{
            if(a[0] > b[0]) return 1
            if(a[0] < b[0]) return -1
            if(a[1] > b[1]) return 1
            if(a[1] < b[1]) return -1
            if(a[2] > b[2]) return 1
            if(a[2] < b[2]) return -1
        }).map(act=>act.join(','))
    const accounts = [ ...newlines, ...oldAccounts]

    fs.writeFileSync(FILE_NAME_COA,header + accounts.join('\n'))
}