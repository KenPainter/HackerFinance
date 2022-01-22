/**
 * Responsibilities of a transform.
 * 
 * Overall, convert a row from an input into the Transaction interface
 * 
 * Account: Passed in to the routine
 * Date: must be 8 digit YYYYMMDD (allows sorts and ranges using string comparisons)
 * amount: always use function makeNumber() which makes integer values to avoid 
 *         floating point arithmetic nonsense.  We divide / 100 when reporting
 *         reliably converts 123.45 to 12345
 *         reliably converts 123.4  to 12340
 *         reliably converts 123    to 12300
 * description: anything
 * 
 * NOTES ON POSITIVE/NEGATIVE NUMBERS
 *   For asset accounts: (banking, retirement, real estate, good), deposits are positive
 *   For liabilities     (revolving credit, loans), payments are positive, spend is negative
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
    /*
    const pieces = inp.split('.')

    // no decimal
    if(pieces.length === 1) 
        return parseInt(inp)*100

    // short decimal, like 123.4
    if(pieces[1].length === 1) 
        return (parseInt(pieces[0])*100 ) + (parseInt(pieces[2])*10 )

    // long decimal, like 123.40 or 123.04
    return (parseInt(pieces[0])*100 ) + parseInt(pieces[1]) 
    */
}

export const transforms = {
    'manual': (acctIgnore:string, fileText:string):Inputs => {
        return linesFromCSV(fileText)
            .map(line=>{
                return { 
                    date: line[1],
                    amount: makeNumber(line[2]),
                    description: line[4],
                    inpAccount: line[0],
                    inpOffset: line[3]
                }
            })
    },

    'chaseBanking': (acct:string, fileText:string):Inputs => { 
        return linesFromCSV(fileText)
            .map(line=>{
                return { 
                    date: dateFromMDY(line[1]),
                    amount: makeNumber(line[3]),
                    description: line[2],
                    inpAccount: acct,
                    inpOffset: '',
                }
            })
    },

    'chaseCC': (acct:string, fileText:string):Inputs => {
        return linesFromCSV(fileText)
            .map(line=> {
                return {
                    account: acct,
                    date: dateFromMDY(line[1]),
                    amount: makeNumber(line[5]),
                    description: line[2],
                    inpAccount: acct,
                    inpOffset: '',
                }
            })
    },

    'capOneCC': (acct:string, fileText:string, gd):Inputs => {
        return linesFromCSV(fileText) 
            .map(line=> {
                const debit = line[5].length===0 ? 0 : makeNumber(line[5])
                const credit= line[6].length===0 ? 0 : makeNumber(line[6])
                return {
                    date: line[1].replace(/\-/g,''),
                    amount: credit-debit,
                    description: line[3],
                    inpAccount: acct,
                    inpOffset: '',
                }
            })
    },

}