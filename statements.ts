
import { AccountMap, Inputs } from './src/common/schema'
import { logBadNews,logGroup,logGroupEnd } from "./src/common/log";
import { Files } from "./src/common/Files"

import { loadTransactionMap } from "./src/dataLayer/transactionMap";
import { loadChartOfAccounts } from "./src/dataLayer/chartOfAccounts";

import { Statement } from "./src/Statement";

const FILES = new Files()
FILES.init()

const msg= "Run statements as-of a date"

logGroup(msg)

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
const inputs:Inputs = loadTransactionMap(FILES.pathClosed())
const filteredInputs = inputs.filter(trx=>trx.date<=date)

const statement = new Statement()
statement.runEverything(FILES.pathStmClosed(),chart,filteredInputs)

logGroupEnd(msg)