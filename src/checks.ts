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

    /*
    // Check: ledger file exists
    check = 'Working ledger exists: ' + WORK_FILE_LEDGER
    if(!fs.existsSync(WORK_FILE_LEDGER)) {
        checksNotOk.push(check)
    } else {
        checksOK.push(check)
    }


    // Check: closed version of input cannot exist
    const name_close_input = path.join(CLOSE_DIR_INPUT,inputFiles[0])
    check = 'Input closed file does not exist: ' + name_close_input
    if(fs.existsSync(name_close_input)) {
        checksNotOk.push(check)
    } else {
        checksOK.push(check)
    }

    // Check: closed version of ledger cannot exist
    const name_pieces = inputFiles[0].split('-')
    name_pieces.shift() // lose the transform
    const name_close_ledger = path.join(CLOSE_DIR_LEDGER,'ledger-' + name_pieces.join('-') + '.json')
    check = 'Ledger closed file does not exist: ' + name_close_ledger
    if(fs.existsSync(name_close_ledger)) {
        checksNotOk.push(check)
    } else {
        checksOK.push(check)
    }
    */


function makeCloseInputName(fileName:string) {
    return path.join(config.PATH_CLOSED_INPUTS,fileName)
}