/**
 * first-time.ts
 * This file is part of Hacker Finance
 * 
 * Version 1.0 complete 2022-01-25
 * 
 */
import * as fs from 'fs'
import { config } from './src/config'
import { logDetail, logTitle } from './src/log'

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

logTitle("PROCESS BEGIN: First time setup")

function makeDir(dir:string) {
    if(!fs.existsSync(dir)) {
        logDetail("Creating directory ",dir,"(this directory is in .gitignore)")
        fs.mkdirSync(dir)
    }
    else {
        logDetail("Directory already exists: ",dir)
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
    logDetail("Creating file:",config.FILE_MASTER_USER_CONFIG)
    fs.writeFileSync(config.FILE_MASTER_USER_CONFIG, text_usrConfig)
} 
else {
    logDetail("File already exists: ",config.FILE_MASTER_USER_CONFIG)
}

// Check: Chart of Accounts
if(!fs.existsSync(config.FILE_MASTER_COA)) {
    logDetail("Creating file:",config.FILE_MASTER_COA)
    fs.writeFileSync(config.FILE_MASTER_COA,text_COA)
} 
else {
    logDetail("File already exists: ",config.FILE_MASTER_COA)
}

// Check: Description Map 
if(!fs.existsSync(config.FILE_MASTER_DESCRIPTION_MAP)) {
    logDetail("Creating file:",config.FILE_MASTER_DESCRIPTION_MAP)
    fs.writeFileSync(config.FILE_MASTER_DESCRIPTION_MAP,'Credit Account,Description')
} 
else {
    logDetail("File already exists: ",config.FILE_MASTER_DESCRIPTION_MAP)
}

logTitle("PROCESS COMPLETE: First time setup")