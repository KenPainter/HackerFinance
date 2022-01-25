/**
 * first-time.ts
 * This file is part of Hacker Finance
 * 
 * Create all files you need to get started.
 * These files are not put into the repo because that
 * would conflict with a simple .gitignore
 */
import * as fs from 'fs'
import { config } from './src/config'

const log = console.log

const text_COA = `Group,Subgroup,Account
Equity,Exchange,Transfers
Equity,Exchange,Payments`


const text_usrConfig = `export interface UsrConfig {
    localeCurrencySpecifier: string
    localeCurrencyOptions: {[key:string]:string}
}

export const usrConfig:UsrConfig = {
    localeCurrencySpecifier: 'en-US',
    localeCurrencyOptions: {style:"currency", currency:"USD"}
}`

function makeDir(dir:string) {
    if(!fs.existsSync(dir)) {
        log("Creating directory ",dir,"(this directory is in .gitignore)")
        fs.mkdirSync(dir)
    }
    else {
        log("Directory already exists: ",dir)
    }
}

makeDir('data')
makeDir('data/0-masters')
makeDir('data/1-inputs')
makeDir('data/2-open-batch')
makeDir('data/3-closed-batches')
makeDir('data/4-statements')
makeDir('data/5-imported-inputs')

// Check: usrConfig
if(!fs.existsSync(config.FILE_MASTER_USER_CONFIG)) {
    log("Creating file:",config.FILE_MASTER_USER_CONFIG)
    fs.writeFileSync(config.FILE_MASTER_USER_CONFIG, text_usrConfig)
} 
else {
    log("File already exists: ",config.FILE_MASTER_USER_CONFIG)
}

// Check: Chart of Accounts
if(!fs.existsSync(config.FILE_MASTER_COA)) {
    log("Creating file:",config.FILE_MASTER_COA)
    fs.writeFileSync(config.FILE_MASTER_COA,text_COA)
} 
else {
    log("File already exists: ",config.FILE_MASTER_COA)
}

// Check: Description Map 
if(!fs.existsSync(config.FILE_MASTER_DESCRIPTION_MAP)) {
    log("Creating file:",config.FILE_MASTER_DESCRIPTION_MAP)
    fs.writeFileSync(config.FILE_MASTER_DESCRIPTION_MAP,'Credit Account,Description')
} 
else {
    log("File already exists: ",config.FILE_MASTER_DESCRIPTION_MAP)
}