/**
 * processOpen
 * This program is part of Hacker Finance
 * 
 */

// Utility imports
import { AccountMap, DescriptionMap, Inputs, InputTransaction } from './common/schema';
import { log, logConclusion, logGroup, logGroupEnd } from './common/log';

// Functional imports
import { loadChartOfAccounts, writeChartOfAccounts } from './data/chartOfAccounts';
import { loadTransactionMap, replaceTransactionMap } from './data/transactionMap';
import { loadDescriptionMap, replaceMasterDescriptionMap, replaceOpenDescriptionMap } from './data/descriptionMap';
import { match } from './match'
import { tabulate } from './tabulate'
import { Statement } from './Statement'
import { Files } from './common/Files';

// constants
const FILES = new Files()
FILES.init()

/**
 * Main function
 * 
 * This is a processing routine, so all of the helper functions
 * have or may have side effects.  All side effects are writing
 * to disk, either appending to or replacing files.
 * 
 * The order of operations allows later steps to make use of
 * results of previous steps. 
 * 
 */
export function processOpen() {
    const msgProcessOpen = 'Process open transactions'
    logGroup(msgProcessOpen)

    // SIDE EFFECTS
    // map on description
    const inputs:Inputs = mapThem()

    // SIDE EFFECTS
    // make new map of descriptions on open transactions
    makeOpenDescriptionMap(inputs)

    // SIDE EFFECTS
    // find any new accounts and return the usable result
    const accountsMap:AccountMap = findNewAccounts(inputs)

    // Getting to the end, tell the user what's going on
    const inputsComplete = reportStats(inputs,accountsMap)

    // and finally...
    runStatements(inputsComplete,accountsMap)
}

function mapThem():Inputs {
    const msgMapThem = 'Map open transactions on description'
    logGroup(msgMapThem)
    const descriptionMap:DescriptionMap = loadDescriptionMap()
    const inputs:Inputs = loadTransactionMap(FILES.pathOpen())
    const matched = match(inputs,descriptionMap)
    if(matched > 0) {
        log("There were matches, saving updated transaction map")
        replaceTransactionMap(FILES.pathOpen(),inputs)
    }
    else {
        log("There were no matches on description")
    }
    replaceMasterDescriptionMap(descriptionMap)
    logGroupEnd(msgMapThem)
    return inputs
}

function makeOpenDescriptionMap(inputs:Inputs) {
    const msgNewDescrs = "Compiling descriptions for unmapped transactions"
    logGroup(msgNewDescrs)

    // compile the descriptions for unmatched and matched trxs
    let uDescriptions:Array<string> = []
    let uDescriptionCounts:{[key:string]:number} = {}
    inputs.forEach(trx=>{
        const descr = trx.description.replace(/\"/g,'')
        if(trx.crdAccount==='') {
            if(!uDescriptions.includes(descr)) {
                uDescriptions.push(descr)
                uDescriptionCounts[descr] = 0
            }
            uDescriptionCounts[descr]++
        } 
    })
    log("Found",uDescriptions.length,"unmapped transactions")
    replaceOpenDescriptionMap(uDescriptionCounts)
    logGroupEnd(msgNewDescrs)
}

function findNewAccounts(inputs:Inputs):AccountMap {
    const msgNewAccounts = 'Finding newly referenced accounts in transaction map'
    logGroup(msgNewAccounts)
    const accountsMap = loadChartOfAccounts()

    // Look for new accounts and report them
    const newAccounts:Array<string> = []
    inputs.forEach((trx:InputTransaction)=>{
        const candidates:Array<string> = [ trx.crdAccount.trim(), trx.debAccount.trim() ]
        candidates.forEach(candidate=>{
            if(candidate.length > 0) {                        
                if(!(candidate in accountsMap)) {
                    if(!newAccounts.includes(candidate)) {
                        newAccounts.push(candidate)
                    }
                }
            }
        })
    })


    if(newAccounts.length == 0) {
        log("No new accounts are referenced in open transaction map")
    }
    else {
        newAccounts.sort()
        log(newAccounts.length,"new accounts added to chart of accounts")
        newAccounts.forEach(act=>log("New account:",act))
        writeChartOfAccounts(accountsMap,newAccounts)
    }
    logGroupEnd(msgNewAccounts)
    return accountsMap
}

function reportStats(inputs:Inputs,accountsMap:AccountMap):Inputs {
    let trxTotal:number = 0
    let trxPartial:number = 0
    let trxComplete:number = 0
    let inputsComplete:Inputs = []
    for(const trx of inputs) {
        trxTotal++
        if(trx.crdAccount.length===0 || trx.debAccount.length===0) {
            continue
        }
        if(!(trx.crdAccount in accountsMap)) {
            trxPartial++
            continue;
        }
        if(!(trx.debAccount in accountsMap)) {
            trxPartial++
            continue;
        }
        inputsComplete.push(trx)
        trxComplete++
    } 
    logConclusion("Current status of open transaction map:")
    log("Total transactions:",trxTotal)
    log("Mapped to incomplete accounts:",trxPartial)
    log("Ready to close:",trxComplete)
    return inputsComplete
}

function runStatements(inputsComplete:Inputs,accountsMap:AccountMap) {
    return
    /*
    if(inputsComplete.length === 0) {
        log("No transactions are ready to close, not running any statements.")
        return
    }
    const msgRunStatements = "Running Statements"
    logGroup(msgRunStatements)
    log("Running statements based on ",inputsComplete.length,"transactions that are ready to close.")

    log("Running statements just for trx ready to close")
    const [ aTalliesOpen, accountsFlatOpen ] = tabulate(accountsMap,inputsComplete)
    const statementOpen =  new Statement(aTalliesOpen,accountsFlatOpen)
    statementOpen.runEverything(false,config.PATH_OPEN_REPORTS)

    log("Running statements as they would appear after closing")
    const allInputs = [...inputsComplete,...loadTransactionMap(true) ]
    const [ aTalliesCombo, accountsFlatCombo ] = tabulate(accountsMap,allInputs)
    let statement3 = new Statement(aTalliesCombo,accountsFlatCombo)
    statement3.runEverything(false,config.PATH_COMBO_REPORTS)
    logGroupEnd(msgRunStatements)
    */
}