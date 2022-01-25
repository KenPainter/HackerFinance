import { AccountMap, Inputs, Ledger, AccountTallies, AccountsFlat, AccountStats, LedgerTransaction } from "./schema"
import { config } from './config'

export function tabulate(chart:AccountMap,trxs:Inputs):[AccountTallies,AccountsFlat] {
    let t:AccountTallies = {}

    // first thing is "double" the transactions and put into reporting format
    const ledger:Ledger = trxs.reduce((acc,trx)=>{
        const amount = Math.round(parseFloat(trx.amount)*100)
        // the first transaction
        const trx1 = { 
            date: trx.date,
            description: trx.description,
            sourceFile: trx.srcFile,
            dbAmount: amount,
            dbGroup: chart[trx.debAccount][0],
            dbSubgroup: chart[trx.debAccount][1],
            dbAccount: trx.debAccount,
            crGroup: chart[trx.crdAccount][0],
            crSubgroup: chart[trx.crdAccount][1],
            crAccount: chart[trx.crdAccount][2]
        }
        // the reverse transaction
        const trx2 = {
            date: trx.date,
            description: trx.description,
            sourceFile: trx.srcFile,
            dbAmount: -amount,
            dbGroup: chart[trx.crdAccount][0],
            dbSubgroup: chart[trx.crdAccount][1],
            dbAccount: trx.crdAccount,
            crGroup: chart[trx.debAccount][0],
            crSubgroup: chart[trx.debAccount][1],
            crAccount: chart[trx.debAccount][2]
        }
        acc.push(trx1)
        acc.push(trx2)
        return acc
    },[])


    // Statements require all groups to be present.  They will not all
    // be present when reporting on a batch, as it has a very limited
    // set of groups.  So just add them all in at the top.
    config.GROUPS_TB.forEach(group=>{
        t[group] = new AccountStats()
    })

    let accountsFlat = []
    // Iterate the transactions to build tree
    Object.values(ledger).forEach((trx:LedgerTransaction)=>{
        const group = trx.dbGroup
        const subgroup = trx.dbSubgroup
        const account = trx.dbAccount
        if(!(group in t)) 
            t[group] = new AccountStats()
        if(!(subgroup in t[group].children))
            t[group].children[subgroup] = new AccountStats()
        if(!(account in t[group].children[subgroup].children))
            t[group].children[subgroup].children[account] = new AccountStats()
    })

    for(const trx of ledger) {
        // Group Level
        const g = t[trx.dbGroup]
        g.balance += trx.dbAmount
        g.trxCount++
        if(g.minDate > trx.date) g.minDate = trx.date
        if(g.maxDate < trx.date) g.maxDate = trx.date

        // Subgroup Level
        const s = g.children[trx.dbSubgroup]
        s.balance += trx.dbAmount
        s.trxCount++
        if(s.minDate > trx.date) s.minDate = trx.date
        if(s.maxDate < trx.date) s.maxDate = trx.date

        // Account level
        const a = s.children[trx.dbAccount]
        a.balance += trx.dbAmount
        a.trxCount++
        if(a.minDate > trx.date) a.minDate = trx.date
        if(a.maxDate < trx.date) a.maxDate = trx.date
        a.transactions.push(trx)
    }

    // get flattened list of accounts and sort them
    for(const g of Object.keys(t)) {
        const subgroups = Object.keys(t[g].children)
        for(const s of subgroups) {
            const accounts = Object.keys(t[g].children[s].children)
            for(const a of accounts) {
                accountsFlat.push([g,s,a,t[g].children[s].children[a].trxCount])
            }
        }
    }
    accountsFlat.sort((a,b)=>{
        if(a[0] > b[0]) return 1
        if(a[0] < b[0]) return -1
        if(a[1] > b[1]) return 1
        if(a[1] < b[1]) return -1
        if(a[2] > b[2]) return 1
        if(a[2] < b[2]) return -1
    })

    return [ t , accountsFlat]
}