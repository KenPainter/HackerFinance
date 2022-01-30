import { config } from './src/config'
import { loadChartOfAccounts } from "./src/chartOfAccounts";
import { logBadNews, logTitle } from "./src/log";
import { AccountMap, Inputs } from './src/schema'
import { Statement } from "./src/Statement";
import { tabulate } from "./src/tabulate";
import { loadTransactionMap } from "./src/transactionMap";

logTitle("PROCESS BEGIN: Run statements as-of a date")

// look for one argument, which we take as the date
const args = process.argv
let date = ''
let okAlready = false
while(args.length>2) {
    if(okAlready) {
        logBadNews("I expect only one parameter, a date, in format YYYYMMDD")
        process.exit()
    }
    date = args.pop()
    okAlready = true
}
if(!okAlready) {
    logBadNews("I expected one parameter, a date, in format YYYYMMDD")
    process.exit()
}

// Still here? we are ready to go
const chart:AccountMap = loadChartOfAccounts()
const inputs:Inputs = loadTransactionMap(true)
const filteredInputs = inputs.filter(trx=>trx.date<=date)

// Get tallies and flattened account
const [ accountTallies, accountsFlat ] = tabulate(chart,filteredInputs)

const statement = new Statement(accountTallies,accountsFlat)
statement.runEverything(false,config.PATH_CLOSED_REPORTS)
