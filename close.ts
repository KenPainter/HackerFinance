/**
 * Close a working set.
 * 
 * 
 */
import * as fs from 'fs'
import * as path from 'path'
import { report } from 'process'
import { checkInput, checkChartOfAccounts, checkDescriptionMap, checkLedgerExists } from './src/checks'
import { makeCloseInputName, makeCloseLedgerName } from './src/checks'
import { clearToDo, haveToDo, reportToDo } from './src/todo'
import { config } from './src/config'

main()

function main() {
    clearToDo()

    // Check inputs
    checkInput()
    checkChartOfAccounts()
    checkDescriptionMap()
   
    checkLedgerExists()

    if(haveToDo()) {
        reportToDo()
        console.log("")
        console.log("Not all checks passed, I cannot do anything")
        return
    }

    // Still here?  OK, everything is good let's do it
    const fileName = fs.readdirSync(config.PATH_OPEN_INPUT)[0]
    const fileSource = path.join(config.PATH_OPEN_INPUT,fileName)
    const closedInput = makeCloseInputName(fileName)
    const closedLedger = makeCloseLedgerName(fileName)
    console.log("Copying From/To",fileSource,closedInput)
    fs.copyFileSync(fileSource,closedInput)
    console.log("Copying From/To",config.PATH_OPEN_LEDGER,closedLedger)
    fs.copyFileSync(config.PATH_OPEN_LEDGER,closedLedger)

    console.log("")
    console.log("All done, the batch is closed.  You can run `ts-node statements` now")
    return

}
