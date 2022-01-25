import * as fs from 'fs'

import { AccountMap  } from './schema'
import { config } from './config';
import { logWarn } from './log'

// Note that checks should have already been run
// before calling this function
export function loadChartOfAccounts():AccountMap {
    let accountMap:AccountMap = {}
    let warnings:Array<string> = []
    fs.readFileSync(config.FILE_MASTER_COA,'utf8')
        .split('\n')
        .slice(1)
        .filter(line=>line.length>0)
        .map(line=>line.split(','))
        .filter(line=>{
            if(line.length !== 3) {
                warnings.push(`Line does not have 3 fields, it was dropped: ${line}`)
                return false
            }
            if(line[2]==='') {
                warnings.push(`Line has no account (3rd field), it was dropped: ${line}`)
                return false
            }
            if(line[0].trim().length===0 || line[1].trim().length===0) {
                warnings.push(`Line "${line.join(',')}" was dropped, Group or Subgroup missing`)
                return false
            }
            if(!config.GROUPS_TB.includes(line[0].trim())) {
                console.log('warning',line[0])
                warnings.push(`Line "${line.join(',')}" was dropped, it must have Group (first field) be one of [${config.GROUPS_TB.join(', ')}]`)
                return false
            }
            return true
        })
        .forEach(line=>{
            accountMap[line[2]] = [ line[0].trim(), line[1].trim(), line[2].trim() ]
        })
        if(warnings.length > 0) {
            const warnLine = warnings.length.toString() + ' lines were dropped while loading chart of accounts'
            logWarn(warnLine,config.FILE_MASTER_COA,...warnings)
        }

    return accountMap
}

export function writeChartOfAccounts(chart:AccountMap,newAccounts:Array<string>) {
    const header = 'Group,Subgroup,Account\n'
    const newlines = newAccounts.map(act=>`,,${act}`)
    const oldAccounts = Object.values(chart).sort((a,b)=>{
        if(a[0] > b[0]) return 1
        if(a[0] < b[0]) return -1
        if(a[1] > b[1]) return 1
        if(a[1] < b[1]) return -1
        if(a[2] > b[2]) return 1
        if(a[2] < b[2]) return -1

    }).map(act=>act.join(','))
    const accounts = [ ...newlines, ...oldAccounts]

    fs.writeFileSync(config.FILE_MASTER_COA,header + accounts.join('\n'))
}