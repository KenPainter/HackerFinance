import * as fs from 'fs'

const FILE = 'working-set/inputs/manual-x-x.csv'
const TODO = 'working-set/cooperative/to-do.txt'

if(!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE,'Input Account,Date,Amount,Offset Account,Description')
    fs.writeFileSync(TODO,"Run > ts-node working at least once before closing")
}
else {
    console.log("File",FILE,"already exists, refusing to overwrite.")
}