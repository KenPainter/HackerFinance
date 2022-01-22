import * as fs from 'fs'
import * as path from 'path'

import { Inputs } from './schema'
import { transforms } from './process-transforms'
import { addToDo } from './todo'
import { log } from './log'

import { config } from './config'

export function loadInput():Inputs {
    let inputs:Inputs = []
    const fileName = fs.readdirSync(config.PATH_OPEN_INPUT)[0]
    const fileSpec = path.join(config.PATH_OPEN_INPUT,fileName)
    const pieces = fileName.split('-')
    const transformName = pieces.shift()
    const account = pieces.shift()

    if(!(transformName in transforms)) {
        addToDo(`Input file ${fileSpec}, somebody has to code up transform ${transformName}`)
        addToDo(`FYI, the transforms available are: ${Object.keys(transforms).join(', ')}`)
    }
    else {
        const fileContent = fs.readFileSync(fileSpec,'utf8')
        inputs = transforms[transformName](account,fileContent)
        log(1,inputs.length,"Transactions loaded from",fileSpec)
    }
    return inputs
}