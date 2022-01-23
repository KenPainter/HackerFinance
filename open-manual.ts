import * as fs from 'fs'
import * as path from 'path'
import { config } from './src/config'

const FILE = path.join(config.PATH_OPEN_INPUT,'manual-x-x.csv')

if(!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE,'Debit Account,Date,Amount,Credit Account,Description')
}
else {
    console.log("File",FILE,"already exists, refusing to overwrite.")
}