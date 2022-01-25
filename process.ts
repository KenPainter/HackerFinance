/**
 * process.ts
 * This program is part of Hacker Finance
 * 
 * This is the main program for processing an open batch
 */
// node imports
import { processOpen } from './src/processOpen'
import { logBad } from './src/log'

// see if they asked to close all complete transactions
const args = process.argv
const message = 'Sorry, I only accept one optional parameter: "close", as in "ts-node process close"' 
let close = false
let ok = true
if(args.length > 3) {
    logBad(message)
    ok = false
}
else {
    if(args.length === 3) {
        if(args[2] !== 'close') {
            logBad(message)
            ok = false
        }
        close = true
    }
}

if(ok) {
    processOpen(close)
}