export type Group = string
export type Subgroup = string
export type Account = string
export type DescriptionMap = Array<[string,Account]>
export type TransactionMap = {[key:string]:Account}
export type AccountTotals = {[key:string]:number}
export type TodoList = Array<string>

export type ChartAccount = [Group,Subgroup,Account]
export type Chart = {[key:string]:ChartAccount}

export type Inputs = Array<InputTransaction>
export type Ledger = Array<LedgerTransaction>

export interface InputTransaction {
    // This is everything that might appear on an input
    date: string
    amount: number
    description: string
    inpAccount: string
    inpOffset: string
    // Assigned by the system
    sourceFile?: string
    // These are fields that are appended during matching
    computedOffset?: string
    computedReason?: string
    computedDetail?: string
}

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
    matchMethod: string
    matchDetail: string
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