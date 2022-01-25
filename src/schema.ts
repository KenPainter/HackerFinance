// Related to inputs
export type Inputs = Array<InputTransaction>
export interface InputTransaction {
    crdAccount: string
    debAccount: string
    date: string
    amount: string
    description: string
    srcFile: string
}

// Description map
export type DescriptionMap = {[key:string]:Account}
export type DescriptionCounts= {[key:string]:number};


// Related to Chart of Accounts
export type Group = string
export type Subgroup = string
export type Account = string
export type AccountMap = {[key:string]:ChartAccount}
export type ChartAccount = [Group,Subgroup,Account]

// Related to Reporting
export type Ledger = Array<LedgerTransaction>
export interface LedgerTransaction {
    date: string
    description: string
    sourceFile: string
    dbAmount: number
    dbGroup: string
    dbSubgroup: string
    dbAccount: string
    crGroup: string
    crSubgroup: string
    crAccount: string
}
export type AccountTallies = {[key:string]:AccountStats}
export class AccountStats {
    public minDate:string = '99999999'
    public maxDate:string = '00000000'
    public balance:number = 0
    public trxCount:number = 0
    public children:{[key:string]:AccountStats} = {}
    public transactions:Array<LedgerTransaction> = []
}

export type AccountsFlat = Array<AccountFlat>
export type AccountFlat = [Group,Subgroup,Account,number]
