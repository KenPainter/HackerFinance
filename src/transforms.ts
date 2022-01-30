/**
 * transforms.ts
 * This program is part of Hacker Finance
 * 
 * To write a transform, look at any existing transform 
 * 
 * The transform name should be simple and easy to use
 *  - the institution name, like Fidelity, Ameriprise, chase, BankOfAm etc
 *  - the account type, typically 'Banking' or 'CC' for credit card
 *  - examples are seen below, "chaseBanking", "chaseCC", "capOneCC"
 * 
 * The transform maps the downloaded input fields to the 
 * InputTransaction interface (found in src/schema)
 * 
 * When the transform receives a trx, these fields are already
 * filled in (but of course can be overwritten)
 * 
 *    FIELD: debAccount - from the file name
 *    FIELD: srcFile - from the file name
 * 
 * These fields should be populated
 * 
 *    FIELD: Date.  Must be 8 digit YYYYMMDD
 *       If your credit card downloads contain two dates, use the
 *       posting date, because the posting date determines what
 *       statement the transaction will appear on.  Since the user
 *       needs the statement to reconcile the balance, we have to
 *       go by what shows up on the statement.
 * 
 *    FIELD: Amount.  A decimal number represented as a string (no currency symbols or formatting)
 *      - for asset accounts like checking and savings, money coming in is positive
 *      - for liability accounts like credit cards, spending is negative, payments are positive
 * 
 *    FIELD: Description. Whatever is provided
 * 
 * 
 */ 

import { InputTransaction,Transform,Line } from './schema'

const dateFromMDY = (text:string):string => text.slice(-4) + text.slice(0,2) + text.slice(3,5)

export const transforms:{[key:string]:Transform} = {
    'manual': {
        fieldCount: 6,
        mapper: (trx:InputTransaction,line:Line):void=> {
            trx.crdAccount = line[0]
            trx.debAccount = line[1]
            trx.date = line[2]
            trx.amount = line[3]
            trx.description = line[4]
        }
    },

    // Not sure how this happened, but some Chase downloads I get
    // have 7 fields, and some end with a comma so they look like
    // they have 8.  So I made two transforms
    "chaseBanking7": {
        fieldCount: 7,
        mapper: (trx:InputTransaction,line:Line):void=>{
            trx.date = dateFromMDY(line[1])
            trx.description = line[2]
            trx.amount = line[3]
        }
    },
    "chaseBanking": {
        fieldCount: 8,
        mapper: (trx:InputTransaction,line:Line):void=>{
            trx.date = dateFromMDY(line[1])
            trx.description = line[2]
            trx.amount = line[3]
        }
    },

    'chaseCC': {
        fieldCount: 7,
        mapper: (trx:InputTransaction,line:Line):void=> {
            trx.date = dateFromMDY(line[1])
            trx.description = line[2]
            trx.amount = line[5]
        }
    },

    'capOneCC': {
        fieldCount: 7,
        mapper: (trx:InputTransaction,line:Line):void=> {
            trx.date = line[1].replace(/\-/g,'')
            trx.description = line[3]

            const debit = line[5].length===0 ? 0 : parseFloat(line[5])
            const credit= line[6].length===0 ? 0 : parseFloat(line[6])
            trx.amount = (credit-debit).toString()
        }
    }
}