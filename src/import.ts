/**
 * import.ts
 * This program is part of Hacker Finance
 */
// Node imports
import * as fs from 'fs'
import * as path from 'path'

// utility imports
import { Inputs } from './schema'
import { logBadNews, logConclusion, logDetail, log, logGroup, logGroupEnd } from './log'
import { formatCurrency } from './Report1992'
import { config } from './config'

// functional imports
import { transforms } from './transforms'
import { appendTransactionMap, transactionMapCount } from './transactionMap'
import { processOpen } from './processOpen'

export function importInputs() {
    // step 1, try to load new files
    logGroup('Loading Input Files')
    const [ newInputs, fileList ] = loadFiles()
    if(newInputs.length==0) {
        logBadNews("Nothing was imported")
    }
    logGroupEnd('Loading Input Files')
    if(newInputs.length==0) {
        return
    }

    // Step 2, move files and data around
    logGroup('Updating open batch')
    appendTransactionMap(newInputs)
    logGroupEnd('Updating open batch')

    const msg = `Moving inputs from ${config.PATH_INPUTS} to ${config.PATH_INPUTS_IMPORTED}`
    logGroup(msg)
    fileList.forEach(fileName=>{
        const movedFrom = path.join(config.PATH_INPUTS,fileName)
        const movedTo = path.join(config.PATH_INPUTS_IMPORTED,fileName)
        log(fileName)
        fs.renameSync(movedFrom,movedTo)
    })
    logGroupEnd(msg)

    // Step 3, process current open batch
    processOpen()
}

function loadFiles():[Inputs,Array<string>] {
    const fileList = fs.readdirSync(config.PATH_INPUTS)
    if(fileList.length===0) {
        logBadNews(`${config.PATH_INPUTS}: There are no input files to process`)
        return [[] as Inputs,[]]
    }

    let inputs:Inputs = []
    let filesList:Array<string> = []
    
    const importedAlready = fs.readdirSync(config.PATH_INPUTS_IMPORTED)

    fileList.forEach(fileName=>{
        const fileSpec = path.join(config.PATH_INPUTS,fileName)
        const pieces = fileName.split('-')
        if(pieces.length < 3) {
            logBadNews(`${fileSpec}: no import, renamee as <transform>-<account>-anything-you-want.csv`)
            return
        }
        const transformName = pieces.shift()
        const account = pieces.shift()

        if(!(transformName in transforms)) {
            logBadNews(`${fileSpec}: no import, somebody has to code up transform '${transformName}'`)
            return
        }
        if(importedAlready.includes(fileName)) {
            logBadNews(`${fileSpec}: no import, file has already been imported`)
            return
        }

        const fileContent = fs.readFileSync(fileSpec,'utf8')
        const fieldCount = transforms[transformName].fieldCount
        const [ goodLines, badLines ] = processCSV(fileContent,fieldCount)
        if(badLines.length > 0) {
            logBadNews(`${fileSpec}: no import, not all lines have ${fieldCount} fields.`)
            badLines.forEach(line=>log("LINE:", line.lineNumber,"TEXT:",line.lineText))
            return
        }

        // Process the actual conversion to InputTransaction 
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

        // Very last thing we do, update list of imported files
        filesList.push(fileName)
    })

    // 
    inputs.sort((a,b)=>{
        if(a.date > b.date) return 1
        if(a.date < b.date) return -1
        if(a.description > b.description) return 1
        if(a.description < b.description) return -1
    })
    return [inputs,filesList]
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