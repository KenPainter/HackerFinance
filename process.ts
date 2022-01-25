/**
 * process.ts
 * This program is part of Hacker Finance
 * 
 * This is the main program for processing an open batch
 * Version 1.0 complete 2022-01-25
 */
// node imports
import { processOpen } from './src/processOpen'
import { logBadNews, logTitle } from './src/log'

logTitle("PROCESS BEGIN: map and report on open batch")

// see if they asked to close all complete transactions
const args = process.argv
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
        logBadNews("I only understand two command line arguments: 'close' and 'match'")
        ok = false
    }
}
if(ok) {
    processOpen(close,match)
}


logTitle("PROCESS COMPLETE: map and report on open batch")