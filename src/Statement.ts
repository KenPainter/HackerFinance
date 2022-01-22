/**
 * Statements.ts
 * This file is part of Hacker Finance
 * 
 * This is a stright start-to-finish script.
 * 
 */
import * as path from 'path'
import { config } from './config'
import { AccountTallies, AccountsFlat } from './schema'
import { Report1992, FieldInfo } from './Report1992'


export class Statement {
    public outPath:string = ''

    constructor(
        public accountTallies: AccountTallies,
        public accountsFlat:AccountsFlat
    ) {}

    runEverything(reportEmptyAccounts:boolean = true,outPath:string = config.PATH_CLOSED_REPORTS) {
        this.outPath = outPath
        const gtb = config.groupsTB
        const gbs = config.groupsBS
        const gis = config.groupsIS
        this.runLevel0('Trial Balance Level 0','trial-balance-0',gtb)
        this.runLevel0('Balance Sheet Level 0','balance-sheet-0',gbs)
        this.runLevel0('Income Statement Level 0','income-statement-0',gis)

        this.runLevel1('Trial Balance Level 1','trial-balance-1',gtb)
        this.runLevel1('Balance Sheet Level 1','balance-sheet-1',gbs)
        this.runLevel1('Income Statement Level 1','income-statement-1',gis)

        this.runLevel2('Trial Balance Level 2','trial-balance-2',gtb)
        this.runLevel2('Balance Sheet Level 2','balance-sheet-2',gbs)
        this.runLevel2('Income Statement Level 2','income-statement-2',gtb)

        this.runTransactions('Transactions','transactions',gtb)

        if(reportEmptyAccounts) {
            this.runEmptyAccounts('Empty Accounts','accounts-empty')
        }
    }

    runLevel0(title:string,filename:string,groups:Array<string>) {
        const r = new Report1992(this.outPath)
        r.init(title,path.join(this.outPath,filename))
        
        r.setFieldInfo([
            { title: 'Group',   type: 'string', size: 12 },
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
            { title: 'Subgroup',   type: 'string', size: 15 },
            { title: 'Debits',  type: 'debit' },
            { title: 'Credits', type: 'credit' },
            { title: 'Min Date',type: 'date' },
            { title: 'Max Date',type: 'date' },
            { title: 'Trx Count',type: 'number', size: 9}
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
            { title: 'Group',   type: 'string', size: 15 },
            { title: 'Subgroup',   type: 'string', size: 15 },
            { title: 'Account',   type: 'string', size: 15 },
            { title: 'Debits',  type: 'debit' },
            { title: 'Credits', type: 'credit' },
            { title: 'Min Date',type: 'date' },
            { title: 'Max Date',type: 'date' },
            { title: 'Trx Count',type: 'number', size: 9}
        ])

        let total = 0
        groups.forEach(group=>{
            const g = this.accountTallies[group]
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

        this.accountsFlat.forEach(flat=> {
            const [g,s,a] = flat
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
            r.printBlank()
        })
        
        r.print()
    }

    runEmptyAccounts(title:string,filename:string) {
        const r = new Report1992(this.outPath)
        r.init(title,path.join(this.outPath,filename))

        r.printAny("These accounts have no transactions.")
        r.printAny("They can safely be removed from the chart of accounts")
        r.printAny("Chart of accounts is in: "+config.PATH_COA)

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
}