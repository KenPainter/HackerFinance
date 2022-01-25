/**
 * transforms.ts
 * This program is part of Hacker Finance
 * Hacker Finance is licensed under GPL Affero Version 3
 * 
 * To write a transform, look at any existing transform 
 * (except manual, it's a bit different).  Copy and paste,
 * rename it, and alter it.
 * 
 * The transform name should be simple and easy to use
 *  - the institution name, like Fidelity, Ameriprise, chase, BankOfAm etc
 *  - the account type, typically 'Banking' or 'CC' for credit card
 *  - examples are seen below, "chaseBanking", "chaseCC", "capOneCC"
 * 
 * The transform maps the downloaded input fields to the 
 * InputTransaction interface (found in src/schema)
 * 
 * Five fields must be provided:
 * 
 * FIELD: Date.  Must be 8 digit YYYYMMDD
 *   If your credit card downloads contain two dates, use the
 *   posting date, because the posting date determines what
 *   statement the transaction will appear on.  Since the user
 *   needs the statement to reconcile the balance, we have to
 *   go by what shows up on the statement.
 * 
 * FIELD: Amount.  Always use function makeNumber()
 *   - for asset accounts like checking and savings, money coming in is positive
 *   - for liability accounts like credit cards, spending is negative, payments are positive
 * 
 * FIELD: Description. Whatever is provided
 * 
 * FIELD: Account.  Use the first passed in parameter
 * 
 * FIELD: inpOffset, must be provided as an empty string
 * 
 */ 

import { Inputs } from './schema'

// Removes ", $ and \r
// Splits into lines, drops first line
// drops blank lines
// drops comment lines
// collapses white space >= 2 length to one space
// splits each line on comma
const linesFromCSV = (text:string):Array<Array<string>> => 
    text.replace(/[\r\"\$]/g,'')
        .split('\n')
        .slice(1)
        .filter(line=>line.length>0)
        .filter(line=>!line.trim().startsWith('//'))
        .map(line=>line.replace(/\s{2,}/g,' '))
        .map(line=>line.split(',')) 

const dateFromMDY = (text:string):string => text.slice(-4) + text.slice(0,2) + text.slice(3,5)

const makeNumber = (inp:string):number => {
    return Math.round(parseFloat(inp)*100)
}

export const transforms = {
    'manual': (acctIgnore:string, srcFile:string, fileText:string):Inputs => {
        return linesFromCSV(fileText)
            .map(line=>{
                return { 
                    crdAccount: line[0],
                    debAccount: line[1],
                    date: line[2],
                    amount: line[3],
                    description: line[4],
                    srcFile: srcFile
                }
            })
    },

    'chaseBanking': (acct:string, srcFile:string, fileText:string):Inputs => { 
        return linesFromCSV(fileText)
            .map(line=>{
                return { 
                    crdAccount: '',
                    debAccount: acct,
                    date: dateFromMDY(line[1]),
                    amount: line[3],
                    description: line[2],
                    srcFile: srcFile
                }
            })
    },

    'chaseCC': (acct:string, srcFile:string, fileText:string):Inputs => {
        return linesFromCSV(fileText)
            .map(line=> {
                return {
                    crdAccount: '',
                    debAccount: acct,
                    date: dateFromMDY(line[1]),
                    amount: line[5],
                    description: line[2],
                    srcFile: srcFile
                }
            })
    },

    'capOneCC': (acct:string, srcFile:string, fileText:string, gd):Inputs => {
        return linesFromCSV(fileText) 
            .map(line=> {
                const debit = line[5].length===0 ? 0 : makeNumber(line[5])
                const credit= line[6].length===0 ? 0 : makeNumber(line[6])
                return {
                    crdAccount: '',
                    debAccount: acct,
                    date: line[1].replace(/\-/g,''),
                    amount: (credit-debit).toString(),
                    description: line[3],
                    srcFile: srcFile
                }
            })
    },
}