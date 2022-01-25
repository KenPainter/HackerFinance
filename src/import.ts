/**
 * import.ts
 * This program is part of Hacker Finance
 */
// Node imports
import * as fs from 'fs'
import * as path from 'path'

// utility imports
import { Inputs, InputTransaction } from './schema'
import { logBadNews, logConclusion, logDetail, logBlank, logCurrency } from './log'
import { config } from './config'

// functional imports
import { transforms } from './transforms'
import { appendTransactionMap, transactionMapCount } from './transactionMap'


export function importInputs() {
    let inputs:Inputs = []
    const importedAlready = fs.readdirSync(config.PATH_INPUTS_IMPORTED)
    fs.readdirSync(config.PATH_INPUTS).forEach(fileName=>{
        const fileSpec = path.join(config.PATH_INPUTS,fileName)
        const pieces = fileName.split('-')
        if(pieces.length < 3) {
            logBadNews(fileSpec,"File will not be imported, name should be <transform>-<account>-anything-you-want.ext")
            return
        }
        const transformName = pieces.shift()
        if(!(transformName in transforms)) {
            logBadNews(fileSpec,`File will not be imported, somebody has to code up transform '${transformName}'`)
            return
        }
        if(importedAlready.includes(fileName)) {
            logBadNews(fileSpec,"This file has already been imported")
            return

        }
        const account = pieces.shift()

        const fileContent = fs.readFileSync(fileSpec,'utf8')
        const inputsOneFile:Inputs = transforms[transformName](account,fileName,fileContent)

        // Do some reporting
        let trxCount = inputsOneFile.length
        let trxTotal = 0
        for(const trx of inputsOneFile) {
            trxTotal+= parseFloat(trx.amount)
        }
        logConclusion("IMPORTED FILE",fileName)
        logDetail("Debit Account:",account)

        logDetail("Trx Count:",trxCount)
        logDetail("Sum of Transactions:",logCurrency(trxTotal))

        // Wrap it up 
        inputs.push(...inputsOneFile)
        const movedSpec = path.join(config.PATH_INPUTS_IMPORTED,fileName)
        //fs.renameSync(fileSpec,movedSpec)
    })

    if(inputs.length===0) {
        logConclusion("No files were imported.")
    }
    else {
        inputs.sort((a,b)=>{
            if(a.date > b.date) return 1
            if(a.date < b.date) return -1
            if(a.description > b.description) return 1
            if(a.description < b.description) return -1
        })
        const existing = transactionMapCount()
        logConclusion("Final transaction counts")
        logDetail("Current transaction map transactions: ",existing)
        logDetail("New transactions to add: ",inputs.length)
        logDetail("Total transactions after import in open batch:",existing + inputs.length)

        appendTransactionMap(inputs)
    }
}