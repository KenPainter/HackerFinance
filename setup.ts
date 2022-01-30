/**
 * first-time.ts
 * This file is part of Hacker Finance
 * 
 * Version 1.0 complete 2022-01-25
 * 
 */
import * as fs from 'fs'
import { config } from './src/config'
import { log, logGroup, logGroupEnd } from './src/log'

const text_COA = `Group,Subgroup,Account
Equity,Exchange,Transfers
Equity,Exchange,Payments
Equity,Exchange,Splits
Equity,Retained,BeginBalances
Equity,Retained,Rollups`


const text_usrConfig = `export interface UsrConfig {
    locale: string
    localeCurrencyOptions: {[key:string]:string}
}

export const usrConfig:UsrConfig = {
    locale: 'en-US',
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
const makeFile = (fileSpec:string,text:string) => {
    if(!fs.existsSync(fileSpec)) {
        log("Creating file:",fileSpec)
        fs.writeFileSync(fileSpec,text)
    } 
    else {
        log("File already exists: ",fileSpec)
    }
}

logGroup("First time setup")
makeDir('debug')
makeDir('data')
makeDir('data/0-masters')
makeDir('data/1-inputs')
makeDir('data/2-open-batch')
makeDir('data/3-closed-batches')
makeDir('data/4-0-statements-open')
makeDir('data/4-1-statements-combo')
makeDir('data/4-2-statements-closed')
makeDir('data/5-imported-inputs')
makeFile(config.FILE_MASTER_USER_CONFIG,'en-US')
makeFile(config.FILE_MASTER_COA,text_COA)
makeFile(config.FILE_MASTER_DESCRIPTION_MAP,'Credit Account,Description')
logGroupEnd("First time setup")