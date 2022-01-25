/**
 * transactionMap.ts
 * This program is part of Hacker Finance
 */

// Node imports
import * as fs from 'fs'

// Utility imports
import { Inputs } from './schema'
import { logWarn } from './log'
import { config } from './config'


export function loadTransactionMap(loadClosed:boolean=false):Inputs {
    const fileSpec = !loadClosed ? config.FILE_OPEN_TRANSACTION_MAP : config.FILE_CLOSED_TRANSACTION_MAP

    const lines= fs.readFileSync(fileSpec,'utf8')
        .split('\n')
        .slice(1)
        .filter(line=>line.length>0)
    if(lines.length === 0) { 
        return []
    }
    return lines.map(whole=>{
            const line = whole.split(',')
            return {
                crdAccount: line[0].trim(),
                debAccount: line[1].trim(),
                date: line[2].trim(),
                amount: line[3],
                description: line[4].trim(),
                srcFile: line[5].trim()
            }
        })
}

const HEADER = 'Credit Account,Debit Account,Date,Amount,Description,Source\n'

export function appendTransactionMap(trxs:Inputs,closedVersion:boolean=false) {
    const fileSpec = !closedVersion ? config.FILE_OPEN_TRANSACTION_MAP : config.FILE_CLOSED_TRANSACTION_MAP
    if(!fs.existsSync(fileSpec)) {
        fs.writeFileSync(fileSpec,HEADER)
    }
    fs.appendFileSync(fileSpec,
        trxs.map(x=>`${x.crdAccount},${x.debAccount},${x.date},${x.amount},${x.description},${x.srcFile}`).join('\n')
    )
}

export function replaceTransactionMap(trxs:Inputs) {
    // In replace mode we unconditionally replace the file
    fs.writeFileSync(config.FILE_OPEN_TRANSACTION_MAP,HEADER)
    appendTransactionMap(trxs)
}