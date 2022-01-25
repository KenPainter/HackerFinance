/**
 * Open a manual input
 * This program is part of Hacker Finance
 * 
 * Version 1.0 complete 2022-01-25
 * 
 */
import * as fs from 'fs'
import * as path from 'path'
import { config } from './src/config'
import { logBadNews, logConclusion, logDetail, logTitle } from './src/log'

const FILE = path.join(config.PATH_INPUTS,'manual-x-x.csv')

logTitle("PROCESS BEGIN: Create Manual Input")
if(!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE,'Debit Account,Date,Amount,Credit Account,Description')
    logConclusion("File created: ",FILE)
}
else {
    logBadNews(FILE,'already exists, will not overwrite')
}
logTitle("PROCESS COMPLETE: Create Manual Input")