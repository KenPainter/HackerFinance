import * as fs from 'fs'
import * as path from 'path'
import { config } from './config'
import { logDetail } from './log'
import { BudgetMap } from './schema'

export function loadLatestBudget():BudgetMap {
    const candidates =fs.readdirSync(config.PATH_MASTERS) 
        .filter(fileName=>fileName.startsWith('budget-'))
    if(candidates.length===0) {
        return {}
    }

    const fileName = candidates.sort().pop()
    logDetail("Found budget ",fileName)
    const fileSpec = path.join(config.PATH_MASTERS,fileName)
    const budgetItems = fs.readFileSync(fileSpec,'utf8')
        .split('\n')
        .slice(1)
        .map(line=>line.split(','))
        .map(line=>line.slice(-2))

    // Sometimes Typescript seems to need this by itself, not at end of chain
    const returnValue:BudgetMap = {}
    budgetItems.forEach(line=>returnValue[line[0]] = parseFloat(line[1]))
    return returnValue
}
