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
import { logBadNews, logConclusion, logDetail, logTitle } from './src/common/log'

const FILE = path.join(config.PATH_INPUTS,'manual-x-x.csv')

logTitle("PROCESS BEGIN: Create Manual Input")
if(!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE,'Credit Account,Debit Account,Date,Amount,Description,Source')
    logConclusion("File created: ",FILE)
}
else {
    logBadNews(FILE,'already exists, will not overwrite')
}
logTitle("PROCESS COMPLETE: Create Manual Input")