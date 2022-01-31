/**
 * Statements.ts
 * This file is part of Hacker Finance
 * 
 * This is a stright start-to-finish script.
 * 
 */
import * as fs from 'fs'
import * as path from 'path'

import { groups } from './common/groups'
import { Files } from './common/Files'

import { AccountTallies, AccountMap, Inputs  } from './common/schema'
import { Report1992, formatCurrency } from './Report1992'
import { tabulate } from './tabulate'

const GROUP_SIZE:number = 9
const OTHER_SIZE:number = 11
const CURRENCY_SIZE:number = 14

const FILES = new Files()
FILES.init()


export class Statement {
    public outPath:string = ''
    public accountTallies:AccountTallies = {}

    runEverything(outPath:string,accountMap:AccountMap,inputs:Inputs) {
        this.outPath = outPath
        this.accountTallies = tabulate(accountMap,inputs)

        const gtb = groups.tb
        const gbs = groups.bs
        const gis = groups.is
        this.runLevel0('Trial Balance Groups','trial-balance-groups',gtb)
        this.runLevel0('Balance Sheet Groups','balance-sheet-groups',gbs)
        this.runLevel0('Income Statement Groups','income-statement-groups',gis)

        this.runLevel1('Trial Balance Subgroups','trial-balance-subgroups',gtb)
        this.runLevel1('Balance Sheet Subgroups','balance-sheet-subgroups',gbs)
        this.runLevel1('Income Statement Subgroups','income-statement-subgroups',gis)

        this.runLevel2('Trial Balance Accounts','trial-balance-accounts',gtb)
        this.runLevel2('Balance Sheet Accounts','balance-sheet-accounts',gbs)
        this.runLevel2('Income Statement Accounts','income-statement-accounts',gis)

        this.runTransactions('Transactions','transactions',gtb)
        this.runBudget('Budget','budget',gis)
    }


    runLevel0(title:string,filename:string,groups:Array<string>) {
        const r = new Report1992(this.outPath)
        r.init(title,path.join(this.outPath,filename))
        
        r.setFieldInfo([
            { title: 'Group',   type: 'string', size: GROUP_SIZE },
            { title: 'Debits',  type: 'debit' },
            { title: 'Credits', type: 'credit' },
            { title: 'Min Date',type: 'date' },
            { title: 'Max Date',type: 'date' },
            { title: 'Trx Count',type: 'number', size: 9}
        ])
        r.printTitles()
        r.printDashes()

        let total = 0
        groups.forEach(group=>{
            const d = this.accountTallies[group]
            total += d.balance
            r.printLine(group,d.balance,d.balance,d.minDate,d.maxDate,d.trxCount)
        })

        r.printDashes()
        r.printLine('',total,total)
        r.print()
    }

    runLevel1(title:string,filename:string,groups:Array<string>) {
        const r = new Report1992(this.outPath)
        r.init(title,path.join(this.outPath,filename))
        
        r.setFieldInfo([
            { title: 'Subgroup',   type: 'string', size: OTHER_SIZE },
            { title: 'Debits',  type: 'debit' },
            { title: 'Credits', type: 'credit' },
            { title: 'Min Date',type: 'date' },
            { title: 'Max Date',type: 'date' },
            { title: 'Trx Cnt',type: 'number', size: 7}
        ])

        let total = 0
        groups.forEach(group=>{
            let g = this.accountTallies[group]
            r.printLine(group + ' Accounts')
            r.printTitles()
            r.printDashes()

            const keys = Object.keys(g.children)
            keys.sort((a,b)=>Math.abs(g.children[a].balance) > Math.abs(g.children[b].balance) ? -1 : 1)
            keys.forEach(subgroup=>{
                let s = g.children[subgroup]
                if(s.trxCount > 0 && s.balance!==0) {
                    r.printLine(subgroup,s.balance,s.balance,s.minDate,s.maxDate,s.trxCount)
                }
            })

            r.printDashes()
            r.printLine('',g.balance,g.balance)
            r.printBlank()
            total += g.balance
        })

        r.printBlank()
        r.printDashes()
        r.printLine('',total,total)

        r.print()
    }

    runLevel2(title:string,filename:string,groups:Array<string>) {
        const r = new Report1992(this.outPath)
        r.init(title,path.join(this.outPath,filename))
        
        r.setFieldInfo([
            { title: 'Group',   type: 'string', size: GROUP_SIZE },
            { title: 'Subgroup',   type: 'string', size: OTHER_SIZE },
            { title: 'Account',   type: 'string', size: OTHER_SIZE },
            { title: 'Debits',  type: 'debit' },
            { title: 'Credits', type: 'credit' },
            { title: 'Min Date',type: 'date' },
            { title: 'Max Date',type: 'date' },
            { title: 'Trx Cnt',type: 'number', size: 7}
        ])

        let total = 0
        groups.forEach(group=>{
            const g = this.accountTallies[group]
            if(g.trxCount===0 ) {
                return
            }
            r.printTitles()
            r.printDashes()
            Object.keys(g.children).forEach(subgroup=>{
                const s = g.children[subgroup]
                const keys = Object.keys(s.children)
                keys.sort((a,b)=>Math.abs(s.children[a].balance) > Math.abs(s.children[b].balance) ? -1 : 1)
                keys.forEach(account=> {
                    const a = s.children[account]
                    if(a.trxCount > 0 && a.balance!==0) {
                        r.printLine(group,subgroup,account,a.balance,a.balance,a.minDate,a.maxDate,a.trxCount)
                        total+=a.balance
                    }
                })
            })
            r.printDashes()
            r.printLine('','','',g.balance,g.balance)
            r.printBlank()
        })

        r.printBlank()
        r.printDashes()
        r.printLine('','','',total,total)

        r.print()
    }

    runTransactions(title:string,filename:string,groups:Array<string>) {
        const r = new Report1992(this.outPath)
        r.init(title,path.join(this.outPath,filename))

        r.setFieldInfo([
            { title: 'Date'    ,  type: 'date' },
            { title: 'Debit'   ,  type: 'debit' },
            { title: 'Credit'  ,  type: 'credit' },
            { title: 'Offset'  ,  type: 'string', size: 35 },
            { title: 'Description', type: 'string', size: 50}
        ])

        for(const g of Object.keys(this.accountTallies)) {
            for(const s in this.accountTallies[g].children) {
                for(const a in this.accountTallies[g].children[s].children) {
                    const trxs = this.accountTallies[g].children[s].children[a].transactions
                    trxs.sort((a,b)=>a.date > b.date ? 1 : -1)
                    r.printAny(g+ ' - ' + s + ' - ' + a)
                    r.printTitles()
                    r.printDashes()
                    for(const trx of trxs) {
                        r.printLine(trx.date,trx.dbAmount,trx.dbAmount,
                            trx.crGroup + ' - ' + trx.crSubgroup + ' - ' + trx.crAccount,
                            trx.description
                        )
                    }
                }
            }
        }
        
        r.print()
    }

    runBudget(title:string,fileName:string,groups:Array<string>) {
        const r = new Report1992(this.outPath)
        r.init(title,path.join(this.outPath,fileName))

        r.setFieldInfo([
            { title: 'Group'    ,  type: 'string', size: GROUP_SIZE },
            { title: 'Subgroup' ,  type: 'string', size: OTHER_SIZE },
            { title: 'Account'  ,  type: 'string', size: OTHER_SIZE },
            { title: 'Budgeted' ,  type: 'number', size: CURRENCY_SIZE  },
            { title: 'Actual YTD', type: 'number', size: CURRENCY_SIZE }
        ])
        r.printTitles()
        r.printDashes()

        const forCSV = []

        let budgeted = 0
        let actuals = 0
        groups.forEach(g=>{
            for(const s in this.accountTallies[g].children) {
                for(const a in this.accountTallies[g].children[s].children) {
                    const aTallies = this.accountTallies[g].children[s].children[a]
                    if(aTallies.budget===0 && aTallies.balance===0) 
                        continue;
                    r.printLine(
                        g,
                        s,
                        a,
                        aTallies.budget,
                        -aTallies.balance/100
                    )
                    budgeted+=aTallies.budget
                    actuals-=aTallies.balance/100
                    forCSV.push([g,s,a,aTallies.budget,-aTallies.balance/100])
                }
            }
        })
        r.printDashes()
        r.printLine('','','',budgeted,actuals)
        
        r.print()

        // Now do some extra, save the budget as a CSV, it's easier
        // to play around with that way
        const fileNameCSV = path.join(this.outPath,'budget.csv')
        const headers = 'Group,Subgroup,Account,Budget,Actual\n'
        const lines = forCSV.map(line=>line.join(','))
        fs.writeFileSync(fileNameCSV,headers+lines.join('\n'))
         
    }

    /*
    runEmptyAccounts(title:string,filename:string) {
        const r = new Report1992(this.outPath)
        r.init(title,path.join(this.outPath,filename))

        r.printAny("These accounts have no transactions.")
        r.printAny("They can safely be removed from the chart of accounts")
        r.printAny("Chart of accounts is in: "+config.FILE_MASTER_COA)

        const tolist = this.accountsFlat.filter(act=>act[3]===0)
        if(tolist.length===0) {
            r.printBlank()
            r.printAny(' --- NONE -- ALL ACCOUNTS HAVE TRANSACTIONS ---')
        } 
        else {
            tolist.forEach(act=>{
                r.printAny(act[0] + ' - ' + act[1] + ' - ' + act[2])
            })
        }


        r.print()
    }
    */
}