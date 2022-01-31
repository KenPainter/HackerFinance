import chalk from 'chalk'

const SPACE = '  '

// Put titles before and after group open/close
export const logGroup = (title:string) => {
    console.log(chalk.greenBright(`PROCESS BEGIN: ${title}`))
    console.group()
}
export const logGroupEnd = (title:string) => {
    console.groupEnd()
    console.log(chalk.greenBright(`PROCESS COMPLETE: ${title}`))
}

// Simplest possible default logging
export const log = (...args) => console.log(...args)

export const logBadNews = (msg:string) => {
    console.log(chalk.red.bold(`Bad news: ${msg}`))
}

export const logTitle = (arg:string) => {
    console.log("")
    console.log(chalk.greenBright(arg))
    console.log("")
}

export const logConclusion = (...args) => {
    console.log(chalk.magenta(...args))
}
export const logBlank = () =>  console.log("")

export const logDetail = (...args) => console.log(SPACE,SPACE,chalk.white(...args))

export const logWarnings = (...args) => {
    logBlank()
    console.log(SPACE,chalk.yellow(args[0]))
    args.slice(1).forEach(arg=>console.log(SPACE,SPACE,arg))
    logBlank()
}




