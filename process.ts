/**
 * process.ts
 * This program is part of Hacker Finance
 * 
 * This is the main program for processing an open batch
 */
// Low-level utilities
import { log } from './src/log'
import { config } from './src/config'
import { clearToDo, haveToDo, reportToDo } from './src/todo'
import { checkInput, checkChartOfAccounts, checkDescriptionMap } from './src/checks'
import { dumpJSON } from './src/dumpJSON'

// Functional imports
import { loadInput } from './src/process-loadInput'
import { loadChartOfAccounts, writeChartOfAccounts } from './src/chartOfAccounts'
import { loadDescriptionMap, writeDescriptionMap, loadTransactionMap, writeTransactionMap } from './src/process-maps'
import { matchLogic } from './src/process-matchLogic'
import { tabulate } from './src/tabulate'
import { Statement } from './src/Statement'

// Schema Imports
import {
    Inputs, Chart, 
    DescriptionMap, TransactionMap,
    Ledger
} from './src/schema'
import { inputsToLedger } from './src/inputsToLedger'

// Process end 
const doExit = () => {
    log(0,"HACKER FINANCE process complete")
    process.exit()
}

//
// ---- process start ----
//
log(0,'HACKER FINANCE process start')

// Start by clearing the To-Do list
clearToDo()

// Run some checks.  These first checks are fatal,
// if any of them fail we stop
checkInput()
checkChartOfAccounts()
checkDescriptionMap()
if(haveToDo()) {
    reportToDo()
    log(0,'')
    log(0,'Please clear up the TO-DO items and run the process again')
    doExit() 
}

// Load the input file into InputTransaction format
const inputTransactions:Inputs = loadInput()

// Masters and maps
const chart:Chart = loadChartOfAccounts()
const descriptionMap:DescriptionMap = loadDescriptionMap()
const transactionMap:TransactionMap = loadTransactionMap()

// Now the magic, match transactions to offset accounts
matchLogic(inputTransactions,descriptionMap,transactionMap)

// If you are hacking on hacker finance, these commands
// dump all the inputs for inspections.  
// Please comment them out before opening a PR
//dumpJSON('chart-of-accounts',chart)
//dumpJSON('descriptionMap',descriptionMap)
//dumpJSON('transactionMap',transactionMap)
//dumpJSON('inputTransactions',inputTransactions)

// Write out the maps and the chart of accounts
writeChartOfAccounts(chart,inputTransactions)
writeDescriptionMap(inputTransactions,descriptionMap)
writeTransactionMap(inputTransactions)

// We are (almost) finished.
log(1,'')
if(haveToDo()) {
    reportToDo()
}
else {
    const ledger:Ledger = inputsToLedger(inputTransactions,chart)
    dumpJSON('ledger',ledger)
    const [ accountDetails, accountsFlat ] = tabulate(chart,ledger)
    dumpJSON('accountDetails',accountDetails)
    dumpJSON('accountsFlat',accountsFlat)

    const statement = new Statement(accountDetails,accountsFlat)
    statement.runEverything(false,config.PATH_OPEN_REPORTS)

    log(1,'! There are no To-Do items !')
    log(1,`You can view statements in: ${config.PATH_OPEN_REPORTS}`)
    log(1,"If you like the statments, close the batch by running 'ts-node close'")
}

doExit()