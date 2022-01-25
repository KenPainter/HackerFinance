/**
 * Checks
 * This program is part of Hacker Finance
 * 
 * Do various checks to make sure processes can run
 */
import * as fs from 'fs'

import { config } from './config'
import { logBad } from './log'

export function runChecks() {
    if(!fs.existsSync(config.FILE_MASTER_COA)) {
        logBad(`Chart of accounts ${config.FILE_MASTER_COA} is missing, did you run 'ts-node first-time'?`)
        return false
    }
    if(!fs.existsSync(config.FILE_MASTER_DESCRIPTION_MAP)) {
        logBad(`Description map ${config.FILE_MASTER_DESCRIPTION_MAP} is missing, did you run 'ts-node first-time'?`)
        return false
    }
    return true
}
