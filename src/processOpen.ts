/**
 * processOpen
 * This program is part of Hacker Finance
 * 
 */

// Utility imports
import { AccountMap, DescriptionMap, Inputs, InputTransaction } from './schema';
import { logBlank, logConclusion, logDetail } from './log';
import { config } from './config';

// Functional imports
import { runChecks } from './checks'
import { loadChartOfAccounts, writeChartOfAccounts } from './chartOfAccounts';
import { appendTransactionMap, loadTransactionMap, replaceTransactionMap } from './transactionMap';
import { loadDescriptionMap, writeDescriptionMap, writeUnMatchedDescriptions } from './descriptionMap';
import { match } from './match'
import { tabulate } from './tabulate'
import { Statement } from './Statement'

/**
 * Main function
 */
export function processOpen(closeThemUp:boolean = false,doMatch:boolean=false) {
    if(! runChecks()) {
        return;
    }

    // Get the cleaned up chart of accounts
    const accountsMap:AccountMap = loadChartOfAccounts()

    // Load the transactionMap as best as we have it
    const transactionMap:Inputs = loadTransactionMap()

    // Load permanent and current description maps
    const descriptionMap:DescriptionMap = loadDescriptionMap()

    // Match by descriptions happen here, if we can find any
    if(doMatch) {
        match(transactionMap,descriptionMap)
    }

    // compile the descriptions for unmatched and matched trxs
    let uDescriptions:Array<string> = []
    let uDescriptionCounts:{[key:string]:number} = {}
    transactionMap.forEach(trx=>{
        if(trx.crdAccount==='') {
            if(!(trx.crdAccount in uDescriptionCounts)) {
                uDescriptionCounts[trx.description] = 0
                uDescriptions.push(trx.description)
            }
            uDescriptionCounts[trx.description]++
        } 
    })
    // Immediately write this file, as we no longer will be using it
    writeUnMatchedDescriptions(uDescriptionCounts)
    writeDescriptionMap(descriptionMap)

    // Look for new accounts and report them
    const newAccounts:Array<string> = []
    transactionMap.forEach((trx:InputTransaction)=>{
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
    if(newAccounts.length > 0) {
        newAccounts.sort()
        writeChartOfAccounts(accountsMap,newAccounts)
        logBlank()
        logDetail(newAccounts.length,"New accounts added to chart of accounts",config.FILE_MASTER_COA)
        newAccounts.forEach(act=>logDetail("New account ",act))
        logBlank()
    }

    // Pull out the statistics to report
    let trxTotal:number = 0
    let trxPartial:number = 0
    let trxComplete:number = 0
    let completeTrxs:Inputs = []
    let incompleteTrxs:Inputs = []
    for(const trx of transactionMap) {
        trxTotal++
        if(trx.crdAccount.length===0 || trx.debAccount.length===0) {
            incompleteTrxs.push(trx)
            continue
        }
        if(!(trx.crdAccount in accountsMap)) {
            incompleteTrxs.push(trx)
            trxPartial++
            continue;
        }
        if(!(trx.debAccount in accountsMap)) {
            console.log("partial")
            incompleteTrxs.push(trx)
            trxPartial++
            continue;
        }
        trxComplete++
        completeTrxs.push(trx)
    } 

    // get the tallies and run statements on complete transactions
    const [ accountTallies, accountsFlat ] = tabulate(accountsMap,completeTrxs)
    const statement = new Statement(accountTallies,accountsFlat)
    statement.runEverything(false,config.PATH_OPEN_BATCH)

    // Write out final transaction Maps based on whether they asked to close
    if(!closeThemUp) {
        replaceTransactionMap([...incompleteTrxs,...completeTrxs])
    }
    else {
        replaceTransactionMap(incompleteTrxs)
        appendTransactionMap(completeTrxs,true)
        logConclusion("Moved complete transactions to closed transaction map")
    }
        // now run reports on all transactions
        const closedTrx = loadTransactionMap(true)
        //console.log('   Total number of currently closed transactions:',closedTrx.length.toLocaleString())
        const [ aT, aF ] = tabulate(accountsMap,closedTrx)
        let statement2 = new Statement(aT,aF)
        statement2.runEverything()
    

    // Report out the numbers
    logConclusion('All Processing is complete')
    console.log('   Total transactions in transactionMap:',trxTotal)
    console.log('  Transactions with incomplete accounts:',trxPartial)
    if(closeThemUp) {
        console.log('                    Transactions closed:',trxComplete)
    }
    else {
        console.log('            Transactions ready to close:',trxComplete)
    }
    console.log('      Accounts requiring Group,Subgroup:',newAccounts.length)

}
