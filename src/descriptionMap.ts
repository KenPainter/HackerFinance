import * as fs from 'fs'

import { config } from './config'
import { logDetail } from './log';

import { DescriptionCounts, DescriptionMap } from './schema';

export function writeUnMatchedDescriptions(descs:DescriptionCounts) {
    const keys = Object.keys(descs).sort()
    const lines = keys.map(key=>`,${key}(${descs[key]})`)
    logDetail("Writing back open batch description map",config.FILE_OPEN_DESCRIPTION_MAP)
    fs.writeFileSync(config.FILE_OPEN_DESCRIPTION_MAP,
        'CrdAccount,Description\n'
        + lines.join('\n')
    )
}

export function writeDescriptionMap(descriptionMap:DescriptionMap) {
    const keys = Object.keys(descriptionMap).sort()
    const lines = keys.map(key=>`${descriptionMap[key]},${key}`)
    logDetail("Writing back master description map",config.FILE_MASTER_DESCRIPTION_MAP)
    fs.writeFileSync(config.FILE_MASTER_DESCRIPTION_MAP,
        'CrdAccount,Description\n'
        + lines.join('\n')
    )
}

export function loadDescriptionMap():DescriptionMap {
    const retval = {}
    const master = loadOne(config.FILE_MASTER_DESCRIPTION_MAP,retval)
    const masterCount = Object.keys(retval).length
    const open = loadOne(config.FILE_OPEN_DESCRIPTION_MAP,retval) 
    const openCount = Object.keys(retval).length - masterCount
    logDetail(`Loaded ${masterCount} descriptions from ${config.FILE_MASTER_DESCRIPTION_MAP}`)
    logDetail(`Loaded ${openCount} descriptions from ${config.FILE_OPEN_DESCRIPTION_MAP}`)
    return retval
}

function loadOne(fileSpec:string,retval:DescriptionMap) {
    if(!fs.existsSync(fileSpec)) {
        return 
    }
    const lines = fs.readFileSync(fileSpec ,'utf8')
        .split('\n')
        .slice(1)
        .filter(line=>line.length > 0 && !line.startsWith(','))
        .map(line=>line.split(',').map(each=>each.trim()))
        .filter(line=>line.length ===2 && line[1].length >= 3)

    for(const line of lines) {
        retval[line[1]] = line[0]
    }
}


/*
import { log } from './log'
import { config } from './config'

import { DescriptionMap } from './schema'


// All checks should have passed, this program has no checks
export function loadDescriptionMap():DescriptionMap {
    let descriptionMap:DescriptionMap = []
    let descriptionList:Array<string> = []

    const toDoLine:string = `Description Map: ${config.PATH_DESCRIPTON_MAP}:`
    descriptionMap = fs.readFileSync(config.PATH_DESCRIPTON_MAP,'utf8')
        .split('\n')
        .slice(1)
        .filter(line=>line.length > 0 && !line.startsWith(','))
        .map(line=>line.split(',').map(each=>each.trim()))
        .filter(line=>{
            if(line.length < 2) {
                addToDoTwo(toDoLine,`Input line "${line[0]}" has no comma? It was dropped.`)
                return false
            }
            else if(line.length > 2) {
                addToDoTwo(toDoLine,`Input line "${line.join(',')}" has more than one comma? It was dropped.`)
                return false
            }
            else if(line[1].length < 3) {
                addToDoTwo(toDoLine,`Input line "${line.join(',')}" has description 2 characters or less, it was dropped`)
                return false
            }
            return true
        // Include each description only once to remove duplicates
        // explicitly assign return value so Typescript understands it
        }).reduce((acc:DescriptionMap,line)=>{
            if(descriptionList.includes(line[1])) {
                return acc
            }
            descriptionList.push(line[1])
            acc.push([ line[0], line[1] ])
            return acc
        },[])
        log(1,descriptionMap.length," lines loaded from description map",config.PATH_DESCRIPTON_MAP)

    return descriptionMap
}


export function writeDescriptionMap(inpTrxs:Inputs,descriptionMap:DescriptionMap) {
    log(1,`Writing description map to ${config.PATH_DESCRIPTON_MAP}`)
    //  Start our output with all unmatched transactions 
    let text = 'Offset,Description\n'
    let descriptions = []
    inpTrxs.filter(trx=>trx.computedOffset==='').forEach(trx=>{
        if(!descriptions.includes(trx.description)) 
            descriptions.push(trx.description)
    })
    if(descriptions.length>0) {
        // produces:
        // ,descr 1
        // ,descr 2
        // ...for as many lines
        descriptions.sort()
        text += ',' + descriptions.join('\n,') + '\n'
    }

    // Now add the entries the user had supplied at the beginning
    text += descriptionMap
        .map(usrMatch=>usrMatch.join(','))
        .sort()
        .join('\n')

    fs.writeFileSync(config.PATH_DESCRIPTON_MAP,text)
}


export function loadTransactionMap():TransactionMap {
    if(!fs.existsSync(config.PATH_TRANSACTION_MAP)) {
        log(1,"Looks like a new batch, there is no transaction map to load.  This is normal on a new batch.")
        return {}
    }

    const transactionMap = fs.readFileSync(config.PATH_TRANSACTION_MAP,'utf8')
        .split('\n')
        .slice(1)
        .filter(line=>line.length>0 && !line.startsWith(','))
        .filter(line=>{
            const pieces = line.split(',')
            if(pieces.length!==5) {
                addToDoTwo(
                    `Transaction map ${config.PATH_TRANSACTION_MAP}`,
                    `Dropped because it must have 5 fields: "${line}"`
                )
                return false
            }
            return true
        })
        .reduce((acc,trx)=>{
            const pieces = trx.split(',')
            // not well documented, but: offset account, debit account, date, description, amount
            const key = `${pieces[1]}-${pieces[2]}-${pieces[4]}-${Math.abs(parseInt(pieces[3]))}`
            acc[key] =  pieces[0]
            return acc
        },{})
    return transactionMap
}

export function writeTransactionMap(inpTrxs:Inputs) {
    log(1,`Writing transaction map to ${config.PATH_TRANSACTION_MAP}`)
    let text = 'Offset,Source,Date,Amount,Description\n' 

    // unmatched come first
    text+= inpTrxs.filter(trx=>trx.computedOffset==='')
        .sort((a,b)=>{
            if(a.date > b.date) return 1
            if(a.date < b.date) return -1
            if(a.description > b.description) return 1
            if(a.description < b.description) return -1
        })
        .reduce((acc,trx)=>{
            return acc+([trx.computedOffset,trx.inpAccount,trx.date,trx.amount,trx.description]).join(',')+'\n'
    },'')

    // then come matched
    text+= inpTrxs.filter(trx=>trx.computedOffset!=='')
        .sort((a,b) => {
            if(a.date > b.date) return 1
            if(a.date < b.date) return -1
            if(a.description > b.description) return 1
            if(a.description < b.description) return -1
        })
        .reduce((acc,trx)=>{
            return acc+([trx.computedOffset,trx.inpAccount,trx.date,trx.amount,trx.description]).join(',')+'\n'
    },'')

    fs.writeFileSync(config.PATH_TRANSACTION_MAP,text)
}
*/