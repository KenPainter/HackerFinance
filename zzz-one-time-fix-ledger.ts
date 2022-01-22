import { loadChartOfAccounts } from "./src/chartOfAccounts";
import { clearToDo, haveToDo, reportToDo } from "./src/todo";
import { Chart, Inputs, Ledger } from './src/schema'

import * as fs from 'fs' 
import * as path from 'path'

clearToDo()

// Get the chart and validate it is ok
const chart:Chart = loadChartOfAccounts()
if(haveToDo()) {
    reportToDo()
    process.exit()
}

// Load all inputs as Inputs
let files = fs.readdirSync('./ledgers')
for(const file of files) {
    let out:Ledger = []
    const inputs:Inputs = JSON.parse(fs.readFileSync(path.join('./ledgers',file),'utf8'))
    inputs.forEach(inp=>{
        const account1 = chart[inp.inpAccount]
        const account2 = chart[inp.computedOffset]
        // first transcation as debit
        out.push({
            date: inp.date,
            description: inp.description,
            sourceFile: inp.sourceFile,
            dbAmount: inp.amount,
            dbGroup: account1[0],
            dbSubgroup: account1[1],
            dbAccount: account1[2],
            crGroup: account2[0],
            crSubgroup: account2[1],
            crAccount: account2[2],
            matchMethod: inp.computedReason,
            matchDetail: inp.computedDetail
        })
        // second is reversed as credit
        out.push({
            date: inp.date,
            description: inp.description,
            sourceFile: inp.sourceFile,
            dbAmount: -inp.amount,
            dbGroup: account2[0],
            dbSubgroup: account2[1],
            dbAccount: account2[2],
            crGroup: account1[0],
            crSubgroup: account1[1],
            crAccount: account1[2],
            matchMethod: inp.computedReason,
            matchDetail: inp.computedDetail
        })
    })
    fs.writeFileSync(path.join('closed/ledgers',file),JSON.stringify(out,null,2))
}

