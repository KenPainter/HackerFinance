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
Equity,Exchange,Payments
Equity,Exchange,Splits
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
        logDetail("Creating directory ",dir,"(this directory is in .gitignore)")
        fs.mkdirSync(dir)
    }
    else {
        logDetail("Directory already exists: ",dir)
    }
}
const makeFile = (fileSpec:string,text:string) => {
    if(!fs.existsSync(fileSpec)) {
        logDetail("Creating file:",fileSpec)
        fs.writeFileSync(fileSpec,text)
    } 
    else {
        logDetail("File already exists: ",fileSpec)
    }
}

logTitle("PROCESS BEGIN: First time setup")
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
makeFile(config.FILE_MASTER_COA,'Group,Subgroup,Account')
makeFile(config.FILE_MASTER_DESCRIPTION_MAP,'Credit Account,Description')
logTitle("PROCESS COMPLETE: First time setup")