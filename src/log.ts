import * as ncl from 'node-color-log'

const SPACE = '    '

export const logBad = (...args) => {
    ncl.color('red').log(...args)

}
export const logGood = (...args) => {
    ncl.color('green').log(...args)

}
export const logWarn = (...args) => {
    ncl.color('yellow').log(args[0]).color('white')
    args.slice(1).forEach(arg=>ncl.log(SPACE,arg))
}
export const logInfo = (...args) => {
    ncl.color('blue').log(args[0]).color('white')
    args.slice(1).forEach(arg=>ncl.log(SPACE,arg))
}