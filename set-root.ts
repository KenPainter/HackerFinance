/**
 * set-root.ts
 * Establishes a new set of directories for a set
 * 
 * Simple start-to-finish script
 */
import { Files } from './src/common/Files'
import { logBadNews,log } from './src/common/log'

// get right to it...
const msg = "Set New Root"

const args = process.argv
if(args.length !== 3) {
    logBadNews("I expect exactly one parameter naming the root")
}
else {
    const root = args.pop()
    const files = new Files()

    log()
    files.setRoot(root)
    log()
}

