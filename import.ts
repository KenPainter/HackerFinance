import { importInputs } from "./src/import";
import { log, logGroup,logGroupEnd } from './src/log'

const stage = 'Import and process new import files'

log()
logGroup(stage)
importInputs()
logGroupEnd(stage)
log()
