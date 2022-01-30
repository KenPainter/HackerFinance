import { AccountMap, Inputs, Ledger, AccountTallies, AccountsFlat, AccountStats, LedgerTransaction, } from "./schema"
import { config } from './config'
import { writeDebug } from "./debug"

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
            crAccount: chart[trx.crdAccount][2],
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

    // Get a merged list of all accounts named in ledger or COA
    const coaAccounts = Object.keys(chart)
    const allAccounts = Object.values(ledger).reduce((acc,trx)=>{
        if(!(trx.dbAccount in acc)) {
            acc.push(trx.dbAccount)
        }
        return acc
    },coaAccounts)
    // Iterate the transactions to build tree
    const getGroup = (a:string) => a in chart ? chart[a][0] : 'Expense'
    const getSub   = (a:string) => a in chart ? chart[a][1] : '*LEDGER*'
    allAccounts.forEach(acc=>{
        const group = getGroup(acc)
        const subgroup = getSub(acc)
        const account = acc
        if(!(group in t)) 
            t[group] = new AccountStats()
        if(!(subgroup in t[group].children))
            t[group].children[subgroup] = new AccountStats()
        if(!(account in t[group].children[subgroup].children))
            t[group].children[subgroup].children[account] = new AccountStats()
    })

    // Tally up the ledger transactions
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

    // Add budget items from coa to tallies
    coaAccounts.forEach(a=>{
        const g = getGroup(a)
        const s = getSub(a)
        t[g].budget += chart[a][3]
        t[g].children[s].budget += chart[a][3]
        t[g].children[s].children[a].budget = chart[a][3]
    })

    // get flattened list of accounts and sort them
    let accountsFlat = []
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

    writeDebug('tallies',t)    
    writeDebug('accounts-flat',accountsFlat)

    return [ t , accountsFlat]
}