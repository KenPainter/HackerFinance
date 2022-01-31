import * as fs from 'fs'
import * as path from 'path'

import { log } from '../common/log'
import { BudgetMap } from '../common/schema'
import { Files } from '../common/Files'

const FILES = new Files()
FILES.init()

export function loadLatestBudget():BudgetMap {
    const candidates =fs.readdirSync(FILES.pathMasters())
        .filter(fileName=>fileName.startsWith('budget-'))
    if(candidates.length===0) {
        return {}
    }

    const fileName = candidates.sort().pop()
    log("Found budget ",fileName)
    const fileSpec = path.join(FILES.pathMasters(),fileName)
    const budgetItems = fs.readFileSync(fileSpec,'utf8')
        .split('\n')
        .slice(1)
        .filter(line=>line.trim().length!==0)
        .filter(line=>!line.trim().startsWith('//'))
        .map(line=>line.split(','))
        .map(line=>line.slice(-2))

    // Sometimes Typescript seems to need this by itself, not at end of chain
    const returnValue:BudgetMap = {}
    budgetItems.forEach(line=>returnValue[line[0]] = line[1].trim())
    return returnValue
}
