/**
 * Close a working set.
 * 
 * 
 */
import * as fs from 'fs'
import * as path from 'path'

const checksOK:Array<string> = []
const checksNotOk:Array<string> = []

const TO_DO = 'working-set/cooperative/to-do.txt'
const WORK_DIR_INPUT = 'working-set/inputs/'
const WORK_FILE_LEDGER= 'working-set/outputs/ledger.json'
const CLOSE_DIR_INPUT = 'closed/'
const CLOSE_DIR_LEDGER = 'ledgers/'

main()

function printChecks() { 
    checksOK.forEach(check=>console.log('    (OK) ',check))
    checksNotOk.forEach(check=>console.log('(NOT OK) ',check))
}

function main() {
    // Check: to-do is empty
    let check = 'To-Do list is empty: '+TO_DO 
    if(!fs.existsSync(TO_DO) || fs.readFileSync(TO_DO,'utf8').length === 0) {
        checksOK.push(check)
    } else {
        checksNotOk.push(check)
    }


    // Check: only one input file
    check = 'Only one file in ' + WORK_DIR_INPUT
    const inputFiles = fs.readdirSync(WORK_DIR_INPUT)
    if(inputFiles.length > 1) {
        checksNotOk.push(check)
    } else {
        checksOK.push(check)
    }

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

    printChecks()
    if(checksNotOk.length > 0) {
        console.log("")
        console.log("Not all checks passed, I cannot do anything")
        return
    }

    // Still here?  OK, everything is good let's do it
    const work_input = path.join(WORK_DIR_INPUT,inputFiles[0])
    console.log("Copying From/To",work_input,name_close_input)
    fs.copyFileSync(path.join(WORK_DIR_INPUT,inputFiles[0]),name_close_input)
    console.log("Copying From/To",WORK_FILE_LEDGER,name_close_ledger)
    fs.copyFileSync(WORK_FILE_LEDGER,name_close_ledger)

    console.log("")
    console.log("Hacker Finance cowardly refuses to delete files.")
    console.log("To begin your next working-set, first delete this file:")
    console.log("    ",work_input)

    return

}
