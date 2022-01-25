import chalk from 'chalk'

import { formatCurrency } from './Report1992'

const SPACE = '  '


export const logTitle = (arg:string) => {
    console.log("")
    console.log(chalk.greenBright(arg))
    console.log("")
}

export const logBadNews = (...args) => {
    console.log(chalk.red.bold(SPACE,'Bad news:',args[0]))
    console.log(SPACE,SPACE,...args.slice(1))
}
export const logConclusion = (...args) => {
    console.log("")
    console.log(chalk.magenta(SPACE,...args))
}
export const logBlank = () =>  console.log("")

export const logDetail = (...args) => console.log(SPACE,SPACE,chalk.white(...args))

export const logWarnings = (...args) => {
    logBlank()
    console.log(SPACE,chalk.yellow(args[0]))
    args.slice(1).forEach(arg=>console.log(SPACE,SPACE,arg))
    logBlank()
}

export const logCurrency = (arg:number) => formatCurrency(arg)




