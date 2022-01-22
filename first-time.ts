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

// Check: usrConfig
if(!fs.existsSync(config.PATH_USRCONFIG)) {
    log("Creating file:",config.PATH_USRCONFIG)
    fs.writeFileSync(config.PATH_USRCONFIG,text_usrConfig)
} 
else {
    log("File already exists: ",config.PATH_USRCONFIG)
}

// Check: Chart of Accounts
if(!fs.existsSync(config.PATH_COA)) {
    log("Creating file:",config.PATH_COA)
    fs.writeFileSync(config.PATH_COA,text_COA)
} 
else {
    log("File already exists: ",config.PATH_COA)
}

// Check: Chart of Accounts
if(!fs.existsSync(config.PATH_DESCRIPTON_MAP)) {
    log("Creating file:",config.PATH_DESCRIPTON_MAP)
    fs.writeFileSync(config.PATH_DESCRIPTON_MAP,'Offset,Description')
} 
else {
    log("File already exists: ",config.PATH_DESCRIPTON_MAP)
}