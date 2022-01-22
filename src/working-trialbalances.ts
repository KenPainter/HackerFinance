/**
 * Statements.ts
 * 
 * This program is part of Hacker Finance
 * 
 */
import * as fs from 'fs'
import { ChartAccount, Chart, Ledger, Group, Subgroup, Account  } from './schema'

// File Names
const SUMMARY = 'working-set/outputs/trial-balance-summary.txt'
const DETAIL  = 'working-set/outputs/trial-balance-detail.txt'

// Formatting 
const TEXT_WIDTH = 20
const NUM_WIDTH = 12
const NUM_BLANK = ' '.repeat(NUM_WIDTH)
const makeText = (x:string,y:string)=>x.slice(0,18).padEnd(TEXT_WIDTH) + y.slice(0,18).padEnd(TEXT_WIDTH)
const DASHES  = makeText('','')+' ----------- -----------'
const makeDate = (inp:string) => inp.slice(0,4)+'/'+inp.slice(4,6)+'/'+inp.slice(-2)
const makeDebitCredit = (z:number):string => {
    const options = {style:"currency", currency:"USD"}
    const debString = z > 0 ? ( z/100).toLocaleString('en-US',options).padStart(NUM_WIDTH) : NUM_BLANK
    const crdString = z < 0 ? (-z/100).toLocaleString('en-US',options).padStart(NUM_WIDTH) : NUM_BLANK
    return debString + crdString
}
const makeLine = (x:string,y:string,z:number)=>{
    return makeText(x,y)+makeDebitCredit(z)
}

class Report {
    lines:Array<string> = []

    constructor(title:string) {
        this.lines.push(title)
    }

    add(...lines) {
        this.lines.push(...lines)
    }
    blank() { this.lines.push('') }

    list() { return this.lines.join('\n')}
}

// Main entry point
export function trialBalances(chart:Chart,ledger:Ledger) {
    // Get flat sorted list of accounts
    let accountsList = Object.values(chart)
    accountsList.sort((a,b)=>{
        if(a[0] > b[0]) return 1
        if(a[0] < b[0]) return -1
        if(a[1] > b[1]) return 1
        if(a[1] < b[1]) return -1
        if(a[2] > b[2]) return 1
        if(a[2] < b[2]) return -1
    })

    // Run the totals and date range for the ledger
    let g = {
        minDate: '99999999' as string,
        maxDate: '00000000' as string,
        balances: Object.values(chart).map(act=>act[2]).reduce((acc,act)=>{acc[act]=0; return acc},{}) 
    }
    for(const trx of ledger) {
        g.balances[trx.inpAccount] += trx.amount
        g.balances[trx.computedOffset] -= trx.amount
        g.minDate = trx.date < g.minDate ? trx.date : g.minDate
        g.maxDate = trx.date > g.maxDate ? trx.date : g.maxDate
    }

    trialBalanceSummary(accountsList,ledger,g)
    trialBalanceDetail(accountsList,ledger,g)
}

function trialBalanceSummary(accountsList:Array<ChartAccount>,ledger:Ledger,g:any) {
    const report = new Report('Summary Trial Balance')
    report.add(makeDate(g.minDate) + ' - ' + makeDate(g.maxDate))
    report.blank()

    const groups = ['Assets','Liabilities','Equity','Income','Expense']
    groups.forEach(group=>{
        report.add(group)
        let groupTotal = 0

        accountsList.filter(act=>act[0]===group)
            .filter(act=>act[2] in g.balances)
            .filter(act=>g.balances[act[2]] !== 0)
            .forEach(act=> {
                groupTotal += g.balances[act[2]]
                report.add(makeLine(act[1],act[2],g.balances[act[2]]))
            })

        report.add(DASHES) 
        report.add(makeLine(group + ' TOTALS','',groupTotal))
        report.blank()
    })

    fs.writeFileSync(SUMMARY,report.list())
}


function trialBalanceDetail(accountsList:Array<ChartAccount>,ledger:Ledger,g:any) {
    const report = new Report('Detail Trial Balance')
    report.add(makeDate(g.minDate) + ' - ' + makeDate(g.maxDate))
    report.blank()

    accountsList.filter(act=>act[2] in g.balances)
        .filter(act=>g.balances[act[2]] !== 0)
        .forEach(act=> {
            let total = 0
            report.add(act[0]+ ' - ' + act[1] + ' - ' + act[2])
            ledger.filter(trx=>trx.inpAccount === act[2] || trx.computedOffset === act[2])
                .forEach(trx=>{
                    // TO-DO, Is this right?  Flipping the sign?
                    const amount = trx.inpAccount === act[2] ? trx.amount : - trx.amount
                    const offset = trx.inpAccount === act[2] ? trx.computedOffset : trx.inpAccount
                    total+=amount
                    report.add(makeDate(trx.date) + ' ' +
                        makeDebitCredit(amount) +' ' + 
                        offset.padEnd(25) + 
                        trx.description
                    )
                })
            report.add('            ----------- -----------')
            report.add(' '.repeat(11)+makeDebitCredit(total))
            report.blank()
        })

    fs.writeFileSync(DETAIL,report.list())
}
