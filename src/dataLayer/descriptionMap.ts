import * as fs from 'fs'
import * as path from 'path'

import { log } from '../common/log';
import { DescriptionCounts, DescriptionMap } from '../common/schema';
import { Files } from '../common/Files'

// Constants for module
const FILE_NAME_DESCRIPTION_MAP = 'descriptionMap.csv'
const HEADER = "Credit Account,Description"
const FILES = new Files()
FILES.init()

// Normalized
export function loadDescriptionMap():DescriptionMap {
    const masterFile = path.join(FILES.pathMasters(),FILE_NAME_DESCRIPTION_MAP)
    const openFile = path.join(FILES.pathOpen(),FILE_NAME_DESCRIPTION_MAP)

    const retval = {}
    const master = loadOne(masterFile,retval)
    const masterCount = Object.keys(retval).length
    const open = loadOne(openFile,retval) 
    const openCount = Object.keys(retval).length - masterCount
    log("Loaded", masterCount," descriptions from", masterFile)
    log("Loaded", openCount," descriptions from", openFile)
    return retval
}

function loadOne(fileSpec:string,retval:DescriptionMap) {
    if(!fs.existsSync(fileSpec)) {
        return 
    }
    const lines = fs.readFileSync(fileSpec ,'utf8')
        .split('\n')
        .slice(1)
        .filter(line=>line.length > 0 && !line.startsWith(','))
        .map(line=>line.split(',').map(each=>each.trim()))
        .filter(line=>line.length ===2 && line[1].length >= 3)

    for(const line of lines) {
        retval[line[1]] = line[0]
    }
}

export function replaceMasterDescriptionMap(descriptionMap:DescriptionMap) {
    const fileSpec = path.join(FILES.pathMasters(),FILE_NAME_DESCRIPTION_MAP)

    const keys = Object.keys(descriptionMap).sort()
    const lines = keys.map(key=>`${descriptionMap[key]},${key}`)
    log("Overwriting master description map",fileSpec)
    fs.writeFileSync(fileSpec,HEADER+'\n'+lines.join('\n'))
}

export function replaceOpenDescriptionMap(descs:DescriptionCounts) {
    const fileSpec = path.join(FILES.pathOpen(),FILE_NAME_DESCRIPTION_MAP)
    
    const keys = Object.keys(descs).sort()
    const lines = keys.map(key=>`,${key}(${descs[key]})`)
    log("Overwriting open description map",fileSpec)
    fs.writeFileSync(fileSpec,HEADER + '\n' + lines.join('\n'))
}

