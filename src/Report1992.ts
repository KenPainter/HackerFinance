/**
 * Report1992
 * This file is part of Hacker Finance
 * 
 * Run fixed width financial statements like it's 1992
 * 
 */
import * as fs from 'fs'
import { config } from './config'

const LOCALE_OPTIONS = {style:"decimal", minimumFractionDigits:2, maximumFractionDigits:2 }
// FIXME
//const LOCALE = fs.readFileSync(config.FILE_LOCALE,'utf8')
const LOCALE = 'en-US'

export const formatCurrency = (num:number) => 
    num.toLocaleString(LOCALE,LOCALE_OPTIONS).padStart(config.CURRENCY_FORMAT_WIDTH)

export interface FieldInfo {
    type: "string" | "credit" | "debit" | "date" | "number"
    title: string
    size?: number
}

export class Report1992 {
    // For an individual report
    lines:Array<string> = []
    fileSpec:string
    fieldInfo:Array<FieldInfo> = []
    PADDING:string = ' '
    curStr:string = LOCALE
    curObj:{[key:string]:any} = LOCALE_OPTIONS

    constructor(public outPath:string) {}

    init(title:string,fileName) {
        this.lines = [ title, '' ]
        this.fileSpec = `${fileName}.txt`
    }
    setFieldInfo(info) {
        this.fieldInfo = info.map(fld=>{
            if(['debit','credit'].includes(fld.type)) {
                fld.size = config.CURRENCY_FORMAT_WIDTH
            }
            if(fld.type==='date') {
                fld.size = 10
            }
            return fld
        })
    }
    printBlank() {
        this.lines.push('')
    }
    printAny(str:string) {
        this.lines.push(str)
    }
    printTitles() {
        let values = []
        for(const field of this.fieldInfo) {
            if(['string','date'].includes(field.type)) {
                values.push(field.title.padEnd(field.size))
            }
            else {
                values.push(field.title.padStart(field.size))
            }
        }
        this.lines.push(values.join(this.PADDING))
    }
    printDashes() {
        const dashes = this.fieldInfo.map(fld=>'-'.repeat(fld.size))
        this.lines.push(dashes.join(this.PADDING))

    }
    printLine(...values:Array<any>) {
        const printVals = values.map((val,idx)=>{
            const fld = this.fieldInfo[idx]
            if(fld.type==='string') {
                return val.slice(0,fld.size).padEnd(fld.size)
            }
            if(fld.type==='date') {
                return val.slice(0,4)+'-'+val.slice(4,6)+'-'+val.slice(-2)
            }
            if(fld.type==='debit') {
                return val <= 0 
                    ? ' '.repeat(config.CURRENCY_FORMAT_WIDTH)
                    : formatCurrency(val/100)
            }
            if(fld.type==='credit') {
                return val >= 0 
                    ? ' '.repeat(config.CURRENCY_FORMAT_WIDTH)
                    : formatCurrency(-val/100)
            }
            if(fld.type==='number') {
                return val.toLocaleString().padStart(fld.size)
            }

        })
        this.lines.push(printVals.join(this.PADDING))
    }
    print() {
        fs.writeFileSync(this.fileSpec,this.lines.join('\n'))
    }
}