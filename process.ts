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
let match = false
let ok = true
while(args.length > 2) {
    const arg = args.pop()
    if(arg==='close') {
        close = true
    }
    else if(arg==='match') {
        match = true
    }
    else {
        logBad("I only understand two command line arguments: 'close' and 'match'")
        ok = false
    }
}
if(ok) {
    processOpen(close,match)
}