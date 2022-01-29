/**
 * import.ts
 * This program is part of Hacker Finance
 */
// Node imports
import * as fs from 'fs'
import * as path from 'path'

// utility imports
import { Inputs } from './schema'
import { logBadNews, logConclusion, logDetail } from './log'
import { formatCurrency } from './Report1992'
import { config } from './config'

// functional imports
import { transforms } from './transforms'
import { appendTransactionMap, transactionMapCount } from './transactionMap'

type Errors = Array<string>

export function importInputs() {
    let inputs:Inputs = []
    const importedAlready = fs.readdirSync(config.PATH_INPUTS_IMPORTED)
    const fileList = fs.readdirSync(config.PATH_INPUTS)
    if(fileList.length===0) {
        logBadNews(config.PATH_INPUTS,"There are no input files to process")
        return inputs
    }
    
    let importedCount = 0
    fileList.forEach(fileName=>{
        const fileSpec = path.join(config.PATH_INPUTS,fileName)
        const pieces = fileName.split('-')
        if(pieces.length < 3) {
            logBadNews(fileSpec,"File will not be imported, name should be <transform>-<account>-anything-you-want.csv")
            return
        }
        const transformName = pieces.shift()
        const account = pieces.shift()

        if(!(transformName in transforms)) {
            logBadNews(fileSpec,`File will not be imported, somebody has to code up transform '${transformName}'`)
            return
        }
        if(importedAlready.includes(fileName)) {
            logBadNews(fileSpec,"This file has already been imported")
            return

        }

        const fileContent = fs.readFileSync(fileSpec,'utf8')
        const fieldCount = transforms[transformName].fieldCount
        const [ goodLines, badLines ] = processCSV(fileContent,fieldCount)
        if(badLines.length > 0) {
            logBadNews(fileSpec,"At least one line does not have exactly",fieldCount,"values.")
            badLines.forEach(line=>logDetail("LINE:", line.lineNumber,"TEXT:",line.lineText))
            return
        }

        const inputsOneFile = goodLines.map(line=>{
            let trx = {
               crdAccount: '',
               debAccount: account,
               date: '',
               amount: '',
               description: '',
               srcFile: fileName
           } 
           transforms[transformName].mapper(trx,line)
           return trx
        })

        // Do some reporting
        let trxCount = inputsOneFile.length
        let trxTotal = 0
        for(const trx of inputsOneFile) {
            trxTotal+= parseFloat(trx.amount)
        }
        logConclusion("IMPORTED FILE",fileName)
        logDetail("Debit Account:",account)

        logDetail("Trx Count:",trxCount)
        logDetail("Sum of Transactions:",formatCurrency(trxTotal))

        // Wrap it up 
        inputs.push(...inputsOneFile)
        const movedSpec = path.join(config.PATH_INPUTS_IMPORTED,fileName)
        fs.renameSync(fileSpec,movedSpec)
        importedCount++
    })

    inputs.sort((a,b)=>{
        if(a.date > b.date) return 1
        if(a.date < b.date) return -1
        if(a.description > b.description) return 1
        if(a.description < b.description) return -1
    })
    const existing = transactionMapCount()
    logConclusion("Final transaction counts")
    logDetail("Current open transactions: ",existing)
    logDetail("New transactions added: ",inputs.length)
    logDetail("Total open transactions after import:",existing + inputs.length)

    if(inputs.length > 0) {
        appendTransactionMap(inputs)
    }
}

type GoodLines = Array<Array<string>>
type BadLines = Array<BadLine>
interface BadLine  {
    lineNumber: number
    lineText: string
}
const processCSV = (text:string,fieldCount:number):[GoodLines,BadLines] => {
    return text.replace(/\r/g,'')
        .split('\n')
        .reduce((acc,line,idx)=>{
            // skip first line and blanks
            if(idx===0 || line.length===0) return acc

            const pieces = line.split(',')
            if(pieces.length !== fieldCount) {
                acc[1].push({lineNumber:idx+1,lineText:line})
            }
            else {
                // Collapse lengthy whitespace
                acc[0].push(pieces.map(piece=>piece.replace(/\s{2,}/g,' ')))
            }
            return acc

        },[[],[]])
}