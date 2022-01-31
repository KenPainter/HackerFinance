import { groups } from './common/groups'
import { AccountMap, Inputs, Ledger, AccountTallies, AccountStats } from "./common/schema"
import { logGroup, logGroupEnd, log, logWarn } from './common/log'

export function tabulate(chart:AccountMap,trxs:Inputs):AccountTallies {
    const msgTallies = "Compiling transactions for statements"
    logGroup(msgTallies)
    log("Count of accounts in chart of accounts:",Object.keys(chart).length)
    log("Count of transactions to process:",trxs.length)

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
            dbGroup: chart[trx.debAccount].group,
            dbSubgroup: chart[trx.debAccount].subgroup,
            dbAccount: trx.debAccount,
            crGroup: chart[trx.crdAccount].group,
            crSubgroup: chart[trx.crdAccount].subgroup,
            crAccount: trx.crdAccount,
        }
        // the reverse transaction
        const trx2 = {
            date: trx.date,
            description: trx.description,
            sourceFile: trx.srcFile,
            dbAmount: -amount,
            dbGroup: chart[trx.crdAccount].group,
            dbSubgroup: chart[trx.crdAccount].subgroup,
            dbAccount: trx.crdAccount,
            crGroup: chart[trx.debAccount].group,
            crSubgroup: chart[trx.debAccount].subgroup,
            crAccount: trx.debAccount
        }
        acc.push(trx1)
        acc.push(trx2)
        return acc
    },[])
    log("Count of transactions converted to report format:",ledger.length)

    // Unconditionally create top-level for all groups.
    // makes downstream code simpler
    groups.tb.forEach(group=>{
        t[group] = new AccountStats()
    })

    // Get a merged list of all accounts named in ledger or COA
    const coaAccounts = Object.keys(chart)
    const lengthBefore = coaAccounts.length 
    const allAccounts = ledger.reduce((acc,trx)=>{
        if(!acc.includes(trx.dbAccount)) {
            logWarn("Ledger names account not in chart of accounts:",trx.dbAccount)
            acc.push(trx.dbAccount)
        }
        return acc
    },coaAccounts)

    // Iterate the transactions to build tree.  Again, build 
    // unconditionally for all accounts
    const getGroup = (a:string) => a in chart ? chart[a].group : 'Expense'
    const getSub   = (a:string) => a in chart ? chart[a].subgroup: '*LEDGER*'
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
    log("Adding budget figures (if available) to compiled tallies")
    coaAccounts.forEach(a=>{
        const g = getGroup(a)
        const s = getSub(a)
        t[g].budget += parseFloat(chart[a].budget)
        t[g].children[s].budget += parseFloat(chart[a].budget)
        t[g].children[s].children[a].budget = parseFloat(chart[a].budget)
    })
    logGroupEnd(msgTallies)
    return t

    // get flattened list of accounts and sort them
    /*
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

    return [ t , accountsFlat]
    */
}