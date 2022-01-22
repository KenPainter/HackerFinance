import { Inputs, Chart, Ledger } from './schema'

export function inputsToLedger(inputs:Inputs,chart:Chart):Ledger {
    let out:Ledger = []
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
    return out
}