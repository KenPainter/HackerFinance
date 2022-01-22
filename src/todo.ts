import * as fs from 'fs'
import * as path from 'path'
import { config } from './config'

const FILESPEC = config.PATH_TODO

export function clearToDo() {
    fs.writeFileSync(FILESPEC,'')
}
export function haveToDo() {
    if(!fs.existsSync(FILESPEC)) 
        return false
    if(fs.readFileSync(FILESPEC,'utf8').length === 0)
        return false
    return true
}

export function addToDo(text:string) {
    fs.appendFileSync(FILESPEC,' -> ' + text + '\n')
}
export function addToDoTwo(text1:string,text2:string) {
    fs.appendFileSync(FILESPEC,' -> ' + text1 + '\n')
    fs.appendFileSync(FILESPEC,'    ' + text2 + '\n')
}

export function reportToDo() {
    const todoText = fs.readFileSync(FILESPEC,'utf8')
    if(todoText.length > 0) {
        console.log("THERE ARE TO-DO ITEMS BEFORE THE BATCH CAN BE CLOSED")
        console.log("To-do items are in ",path.resolve(FILESPEC))
        console.log("Here they are for handy reference:")
        console.log(todoText)

    }
}