import * as fs from 'fs'

import { Chart, Inputs  } from './schema'
import { config } from './config';
import { addToDoTwo } from './todo';
import { log } from './log'

// Note that checks should have already been run
// before calling this function
const toDoLine = `Chart of accounts: ${config.PATH_COA}`
export function loadChartOfAccounts():Chart {
    let chart:Chart = {}
    fs.readFileSync(config.PATH_COA,'utf8')
        .split('\n')
        .slice(1)
        .filter(line=>line.length>0)
        .map(line=>line.split(','))
        .filter(line=>line[0].trim().length > 0 && line[1].trim().length > 0)
        .filter(line=>{
            if(line.length !== 3) {
                addToDoTwo(toDoLine, `line does not have 3 fields, it was dropped: ${line}`)
                return false
            }
            if(line[2]==='') {
                addToDoTwo(toDoLine, `line has no account (3rd field), it was dropped: ${line}`)
                return false
            }
            if(!config.groupsTB.includes(line[0].trim())) {
                addToDoTwo(toDoLine,`Line "${line.join(',')}" was dropped, it must have Group (first field) be one of [${config.groupsTB.join(', ')}]`)
                return false
            }
            return true
        })
        .forEach(line=>{
            chart[line[2]] = [ line[0].trim(), line[1].trim(), line[2].trim() ]
        })

    return chart
}

export function writeChartOfAccounts(chart:Chart,inpTrxs:Inputs) {
    log(1,"Writing chart of accounts to ",config.PATH_COA)
    inpTrxs.forEach(trx=>{
        if(trx.computedOffset.length > 0 && !(trx.computedOffset in chart)) {
            chart[trx.computedOffset] = ['','',trx.computedOffset]
        }
        if(trx.inpAccount.length > 0 && !(trx.inpAccount in chart)) {
            chart[trx.inpAccount] = ['','',trx.inpAccount]
        }
    })
    const toDoLine = `Chart of accounts: ${config.PATH_COA}`
    Object.values(chart).forEach(entry=>{
        if(entry[0]==='' || entry[1]==='' ) {
            addToDoTwo(toDoLine,`Account "${entry[0]},${entry[1]},${entry[2]}" will need Group and Subgroup`)
        }
    })

    // Sort and flatten
    const sorted:Array<[string,string,string]> = Object.values(chart)
    sorted.sort((a,b)=>{
        // Group
        if(a[0] > b[0]) return 1
        if(a[0] < b[0]) return -1
        // Subgroup
        if(a[1] > b[1]) return 1
        if(a[1] < b[1]) return -1
        // Account
        if(a[2] > b[2]) return 1
        if(a[2] < b[2]) return -1
    })
    const lines = sorted.map(x=>x.join(','))
       
    // write back out the chart of accounts
    fs.writeFileSync(config.PATH_COA,
       'Group,Subgroup,Account\n' + lines.join('\n')
    )

}

// This is the only one that reads and writes in the same call
/*
export function chartOfAccounts(inpTrxs:Ledger):Chart {
    log(1,"Loading/Creating chart of accounts from ",CHART_OF_ACCOUNTS)
    // first write out the backup
    if(fs.existsSync(CHART_OF_ACCOUNTS)) {
        fs.copyFileSync(CHART_OF_ACCOUNTS,BACKUP_ACCOUNTS+Date().toString()+'.csv')
    }
    let todos = []

    // now load the chart of accounts
    let chart:Chart = {}
    if(!fs.existsSync(CHART_OF_ACCOUNTS)) {
        log(1,`Chart of Accounts ${MATCH_FILE_BY_TRANSACTION} not found, I'll make one for you now.`)
    }
    else {
        fs.readFileSync(CHART_OF_ACCOUNTS,'utf8')
            .split('\n')
            .slice(1)
            .filter(line=>line.length>0)
            .map(line=>line.split(','))
            .filter(line=>{
                if(line.length !== 3) {
                    todos.push(`Malformed "${line}" was removed.  If it was supposed to be there, add in a corrected line`)
                    return false
                }
                if(line[2]==='') {
                    todos.push(`Line "${line}" with no account was removed.  You might need to put in a corrected line`)
                    return false
                }
                return true
            })
            // as a courtesy, trim all the values
            .map(line=>[line[0].trim(),line[1].trim(),line[2].trim()])
            .forEach(line=>{
                if(line[0].length>0 && line[1].length>0) {
                    chart[line[2]] = [ line[0], line[1], line[2] ]
                }
            })
    }

    if(todos.length > 0) {
        addToDoBatch(`CHART OF ACCOUNTS: ${CHART_OF_ACCOUNTS}`,todos)
    }
    return chart
}

*/
/*
*/