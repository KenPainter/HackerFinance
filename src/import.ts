/**
 * import.ts
 * This program is part of Hacker Finance
 */
// Node imports
import * as fs from 'fs'
import * as path from 'path'

// utility imports
import { Inputs } from './schema'
import { logBad, logGood } from './log'
import { config } from './config'

// functional imports
import { transforms } from './transforms'
import { appendTransactionMap } from './transactionMap'


export function importInputs() {
    let inputs:Inputs = []
    const importedAlready = fs.readdirSync(config.PATH_INPUTS_IMPORTED)
    fs.readdirSync(config.PATH_INPUTS).forEach(fileName=>{
        const fileSpec = path.join(config.PATH_INPUTS,fileName)
        const pieces = fileName.split('-')
        if(pieces.length < 3) {
            logBad("File name should be <transform>-<account>-anything-you-want.ext",fileSpec)
            return
        }
        const transformName = pieces.shift()
        if(!(transformName in transforms)) {
            logBad("Somebody has to code up transform ",transformName,"for",fileSpec)
            return
        }
        if(importedAlready.includes(fileName)) {
            logBad("This file has already been imported: ",fileSpec)
            return

        }
        const account = pieces.shift()

        const fileContent = fs.readFileSync(fileSpec,'utf8')
        const inputsOneFile = transforms[transformName](account,fileName,fileContent)
        logGood(inputsOneFile.length,"transactions imported from",fileSpec)
        inputs.push(...inputsOneFile)

        const movedSpec = path.join(config.PATH_INPUTS_IMPORTED,fileName)
        fs.renameSync(fileSpec,movedSpec)
    })

    appendTransactionMap(inputs)
}