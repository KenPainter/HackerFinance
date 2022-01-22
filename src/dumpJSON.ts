import * as fs from 'fs'
import * as path from 'path'

export function dumpJSON(fileName:string,obj:object) {
    fs.writeFileSync(path.join('./debug/',fileName+'.json'),JSON.stringify(obj,null,2))
}