export const log = (level,...args) => {
    if(level===0) {
        console.log(...args)
    }
    else {
        console.log('    '.repeat(level),...args)
    }
}