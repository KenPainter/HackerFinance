import * as fs from 'fs'
import * as path from 'path'

import { config} from './config'
import { Ledger} from './schema'


export function loadLedgers():Ledger {
    let ledger:Ledger = []
    fs.readdirSync(config.PATH_CLOSED_LEDGERS)
        .forEach(fileSpec=>{
            const ledgerFile = path.join(config.PATH_CLOSED_LEDGERS,fileSpec)
            ledger.push(...JSON.parse(fs.readFileSync(ledgerFile,'utf8'))) 
    })
    return ledger
}
