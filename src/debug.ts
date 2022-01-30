import * as fs from 'fs'
import * as path from 'path'

export function writeDebug(fileName,obj:any){
    const f = path.join('debug/',fileName+".json")
    fs.writeFileSync(f,JSON.stringify(obj,null,2))
}