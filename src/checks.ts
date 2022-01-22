/**
 * Checks
 * This program is part of Hacker Finance
 * 
 * Do various checks to make sure processes can run
 */
import * as fs from 'fs'
import * as path from 'path'

import { config } from './config'
import { addToDo } from './todo'

export function checkInput() {
    const inputFiles = fs.readdirSync(config.PATH_OPEN_INPUT)
    if(inputFiles.length > 1) {
        addToDo(`Directory ${config.PATH_OPEN_INPUT} has more than one file, please provide only one.`)
        return
    }
    if(inputFiles.length ===0 ) {
        addToDo(`Directory ${config.PATH_OPEN_INPUT} has no inputs.  Please provide an input.`)
        return
    }

    const fileName = inputFiles[0]
    const fileSpec = path.join(config.PATH_OPEN_INPUT,inputFiles[0])

    const pieces = fileName.split('-')
    if(pieces.length < 3) {
        addToDo(`Please rename ${fileSpec} in format <transform>-<account>-<your-description>.csv`)
    }

    const closedInputSpec = makeCloseInputName(fileName)
    if(fs.existsSync(closedInputSpec)) {
        addToDo(`Please rename ${fileName} because there is already a closed input with that name.`)
    }
    const closedLedgerSpec = makeCloseLedgerName(fileName)
    if(fs.existsSync(closedLedgerSpec)) {
        addToDo(`Please rename ${fileName} because there is already a closed ledger with that name.`)
    }
}

export function checkChartOfAccounts() {
    if(!fs.existsSync(config.PATH_COA)) {
        addToDo(`Chart of accounts ${config.PATH_COA} is missing, did you run 'ts-node first-time'?`)
    }
}
export function checkDescriptionMap() {
    if(!fs.existsSync(config.PATH_DESCRIPTON_MAP)) {
        addToDo(`Description map ${config.PATH_DESCRIPTON_MAP} is missing, did you run 'ts-node first-time'?`)
    }
}
export function checkLedgerExists() {
    if(!fs.existsSync(config.PATH_OPEN_LEDGER)) {
        addToDo('There is no ledger file at: '+config.PATH_OPEN_LEDGER)
    }
}

export function makeCloseInputName(fileName:string) {
    return path.join(config.PATH_CLOSED_INPUTS,fileName)
}
export function makeCloseLedgerName(fileName:string) {
    const jsonFileName = fileName.split('.')[0] + '.json'
    return path.join(config.PATH_CLOSED_LEDGERS,jsonFileName)
}