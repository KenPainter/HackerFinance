/**
 * transactionMap.ts
 * This program is part of Hacker Finance
 */

// Node imports
import * as fs from 'fs'

// Utility imports
import { Inputs } from './schema'
import { config } from './config'
import { logDetail, log } from './log'

export function transactionMapCount(loadClosed:boolean=false):number {
    const fileSpec = !loadClosed ? config.FILE_OPEN_TRANSACTION_MAP : config.FILE_CLOSED_TRANSACTION_MAP
    if(!fs.existsSync(fileSpec)) {
        return 0
    }
    return fs.readFileSync(fileSpec,'utf8')
        .split('\n')
        .slice(1)
        .length
}

export function loadTransactionMap(loadClosed:boolean=false):Inputs {
    const fileSpec = !loadClosed ? config.FILE_OPEN_TRANSACTION_MAP : config.FILE_CLOSED_TRANSACTION_MAP
    log('Loading transaction map ',fileSpec)

    if(!fs.existsSync(fileSpec)) {
        return []
    }

    const lines= fs.readFileSync(fileSpec,'utf8')
        .split('\n')
        .slice(1)
        .filter(line=>line.length>0)
    //if(lines.length === 0) { 
    //    return []
    //}
    const retval = lines.map(whole=>{
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
    log("Loaded",retval.length,"transactions from open transaction map")
    return retval
}

const HEADER = 'Credit Account,Debit Account,Date,Amount,Description,Source'

export function appendTransactionMap(trxs:Inputs,closedVersion:boolean=false) {
    const fileSpec = !closedVersion ? config.FILE_OPEN_TRANSACTION_MAP : config.FILE_CLOSED_TRANSACTION_MAP
    log('Appending to transaction map ',fileSpec)
    if(!fs.existsSync(fileSpec)) {
        fs.writeFileSync(fileSpec,HEADER)
    }
    fs.appendFileSync(fileSpec,
        '\n'+trxs.map(x=>`${x.crdAccount},${x.debAccount},${x.date},${x.amount},${x.description},${x.srcFile}`).join('\n')
    )
}

export function replaceTransactionMap(trxs:Inputs) {
    // In replace mode we unconditionally replace the file
    logDetail('Overwriting transaction map ',config.FILE_OPEN_TRANSACTION_MAP)

    // resort so mapped trx are at bottom
    trxs.sort((a,b)=>{
        if(a.crdAccount < b.crdAccount) return -1
        if(a.crdAccount > b.crdAccount) return 1
        if(a.date < b.date) return -1
        if(a.date > b.date) return 1
        if(a.description < b.description) return -1
        return 1
    })

    fs.writeFileSync(config.FILE_OPEN_TRANSACTION_MAP,HEADER)
    appendTransactionMap(trxs)
}