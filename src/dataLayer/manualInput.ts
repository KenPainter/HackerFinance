/**
 * Open a manual input
 * This program is part of Hacker Finance
 * 
 * Version 1.0 complete 2022-01-25
 * 
 */
import * as fs from 'fs'
import * as path from 'path'

import { logBadNews, log, logGroup, logGroupEnd } from '../common/log'
import { Files } from '../common/Files'

const FILES = new Files()
FILES.init()

const header = "Credit Account,Debit Account,Date,Debit Amount,Description,Source\n"

export function makeManualInput(trxs:Array<Array<string>>,fileName:string='manual-x-x') {
    logGroup("Creating manual input")
    const fileSpec = path.join(FILES.pathInputs(),fileName+'.csv')
    log("File will be:",fileSpec)
    log("Transaction count:",trxs.length)

    if(fs.existsSync(fileSpec)) {
        logBadNews(`${fileSpec} already exists, will not overwrite`)
    }
    else {
        const lines = trxs.map(trx=>trx.join(','))
        fs.writeFileSync(fileSpec,header + trxs.join('\n'))
    }
    logGroupEnd("Creating Manual Input")
}