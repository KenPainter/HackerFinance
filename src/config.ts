interface Config {
    PATH_OPEN_INPUT: string
    PATH_OPEN_REPORTS: string
    PATH_OPEN_LEDGER: string
    PATH_COA: string
    PATH_TODO: string
    PATH_CLOSED_INPUTS: string
    PATH_CLOSED_LEDGERS: string
    PATH_CLOSED_REPORTS: string
    PATH_USRCONFIG:string

    PATH_DESCRIPTON_MAP:string
    PATH_TRANSACTION_MAP:string

    CURRENCY_FORMAT_WIDTH: number

    groupsTB: Array<string>
    groupsBS: Array<string>
    groupsIS: Array<string>
}



export const config:Config = {
    // Directory Paths
    PATH_OPEN_INPUT: 'open/input/',
    PATH_OPEN_REPORTS: 'open/reports/',
    PATH_OPEN_LEDGER: 'open/ledger/ledger.json',

    // File Paths
    PATH_COA: 'masters/chart-of-accounts.csv',
    PATH_DESCRIPTON_MAP: 'masters/match-by-description.csv',
    PATH_TRANSACTION_MAP: 'open/shared/transactionMap.csv',
    PATH_TODO: 'open/to-do.txt',

    PATH_CLOSED_INPUTS: 'closed/inputs',
    PATH_CLOSED_LEDGERS: 'closed/ledgers',
    PATH_CLOSED_REPORTS: 'closed/reports',

    PATH_USRCONFIG: 'usr/usrConfig.ts',

    // Statement printing options
    CURRENCY_FORMAT_WIDTH: 14,
    groupsTB: [ 'Asset', 'Liability', 'Equity', 'Income', 'Expense'],
    groupsBS: [ 'Asset', 'Liability', 'Equity'],
    groupsIS: [ 'Income', 'Expense'],
}