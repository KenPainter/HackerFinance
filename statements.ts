/**
 * Statements.ts
 * This file is part of Hacker Finance
 * 
 * Runs all statements out of the ./closed/ directory
 *  - loadChartOfAccounts() alwaysloads from ./masters/, there is only one COA
 *  - loadLedgers() always loads from closed ledger dir as specified in ./src/config
 * 
 */
import { Statement } from './src/Statement'
import { loadChartOfAccounts } from './src/chartOfAccounts'
import { tabulate } from './src/tabulate'
import { loadLedgers } from './src/ledger'

const chart = loadChartOfAccounts()
const ledger = loadLedgers()

const [ accountDetails, accountsFlat] = tabulate(chart,ledger)

const statement = new Statement(accountDetails,accountsFlat)
statement.runEverything()
