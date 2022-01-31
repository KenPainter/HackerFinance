/**
 * transactionMap.ts
 * This program is part of Hacker Finance
 */

// Node imports
import * as fs from 'fs'
import * as path from 'path'

// Utility imports
import { Inputs } from '../schema'
import { log } from '../common/log'

// Constants
const FILE_NAME_TRANSACTION_MAP = 'transactionMap.csv'
const HEADER = 'Credit Account,Debit Account,Date,Amount,Description,Source'

export function appendTransactionMap(appendPath:string,trxs:Inputs) {
    const fileSpec = path.join(appendPath,FILE_NAME_TRANSACTION_MAP)
    log('Appending ',trxs.length,'transactions to transaction map ',fileSpec)
    if(!fs.existsSync(fileSpec)) {
        log("Transaction map not present, creating an empty version")
        fs.writeFileSync(fileSpec,HEADER)
    }
    fs.appendFileSync(fileSpec,
        '\n'+trxs.map(x=>`${x.crdAccount},${x.debAccount},${x.date},${x.amount},${x.description},${x.srcFile}`).join('\n')
    )
}

export function replaceTransactionMap(filePath:string,trxs:Inputs) {
    const fileSpec = path.join(filePath,FILE_NAME_TRANSACTION_MAP)

    // In replace mode we unconditionally replace the file
    log('Overwriting transaction map w/no contents',fileSpec)

    // resort so mapped trx are at bottom
    trxs.sort((a,b)=>{
        if(a.crdAccount < b.crdAccount) return -1
        if(a.crdAccount > b.crdAccount) return 1
        if(a.date < b.date) return -1
        if(a.date > b.date) return 1
        if(a.description < b.description) return -1
        return 1
    })

    fs.writeFileSync(fileSpec,HEADER)
    appendTransactionMap(filePath,trxs)
}

export function loadTransactionMap(filePath:string):Inputs {
    const fileSpec = path.join(filePath,FILE_NAME_TRANSACTION_MAP)
    log('Loading transaction map ',fileSpec)

    if(!fs.existsSync(fileSpec)) {
        return []
    }

    const lines= fs.readFileSync(fileSpec,'utf8')
        .split('\n')
        .slice(1)
        .filter(line=>line.length>0)
    const retval = lines.map(whole=>{
            const line = whole.split(',')
            return {
                crdAccount: line[0].trim(),
                debAccount: line[1].trim(),
                date: line[2].trim(),
                amount: line[3].trim(),
                description: line[4].trim(),
                srcFile: line[5].trim()
            }
        })
    log("Loaded",retval.length,"transactions from open transaction map")
    return retval
}


