import * as fs from 'fs'

const REPORTS_DIR = 'reports/'

export function writeStatements(chart:{[key:string]:[string,string,string]},totals:{[key:string]:number}) {
    writeTrialBalance(chart,totals)


}

function writeTrialBalance(chart:{[key:string]:[string,string,string]},totals:{[key:string]:number}) {
    let text = 'TRIAL BALANCE\n\n'
    const sorted:Array<[string,string,string]> = Object.values(chart)
    sorted.sort((a,b)=>{
        if(a[0] > b[0]) return 1
        if(a[0] < b[0]) return -1
        if(a[1] > b[1]) return 1
        if(a[1] < b[1]) return -1
        if(a[2] > b[2]) return 1
        if(a[2] < b[2]) return -1
    })
    sorted.forEach(account=>{
        const act = account[2]
        text += account[0].padEnd(15,' ') + account[1].padEnd(15,' ') + account[2].padEnd(15,' ')
        text += totals[act] > 0 ? (totals[act]/100).toLocaleString().padStart(12,' ') : ' '.repeat(12)
        text += totals[act] < 0 ? (-totals[act]/100).toLocaleString().padStart(12, ' ') : ' '.repeat(12)
        text += "\n"
    })
    fs.writeFileSync(REPORTS_DIR+'trial-balance.txt',text)
}


/*
export function writeIncomeStatement(gd:GlobalDatabase) {
    writeStatement(gd,'incomestatement.txt','Income Statement',['Income','Expense'])
}

export function writeBalanceSheet(gd:GlobalDatabase) {
    writeStatement(gd,'balancesheet.txt','Balance Sheet',['Asset','Liability','Equity'])

}

function writeStatement(gd:GlobalDatabase,fileSpec:string, title:string,types:Array<string>) {
    let lines = [title]
    lines.push('')

    const total = types.reduce((acc,type) => acc+=writeDetail(type),0)
    lines.push('')
    textLine('Change in Net Worth',total)

    fs.writeFileSync('output/'+fileSpec,lines.join('\n'))

    function writeDetail(type:string):number {
        let total = 0

        const transactions = Object.entries(gd.accountTotal).filter(line=>line[0].startsWith(type))
        transactions.forEach(trx=>{
            textLine(trx[0],trx[1])
            total+=trx[1]
        })



        return total
    }

    function textLine(text:string,amount:number) {
        const amountString = (amount/100).toLocaleString()
        const spacing = ' '.repeat(50 - text.length - amountString.length)
        lines.push(text + spacing + amountString)
    }
}
*/