interface Config {
    FILE_LOCALE: string

    PATH_INPUTS: string
    PATH_INPUTS_IMPORTED: string
    PATH_OPEN_BATCH: string

    FILE_OPEN_TRANSACTION_MAP: string
    FILE_CLOSED_TRANSACTION_MAP: string

    FILE_OPEN_DESCRIPTION_MAP: string

    PATH_MASTERS: string
    FILE_MASTER_USER_CONFIG: string
    FILE_MASTER_COA: string
    FILE_MASTER_DESCRIPTION_MAP: string

    PATH_OPEN_REPORTS: string
    PATH_COMBO_REPORTS: string
    PATH_CLOSED_REPORTS: string

    GROUPS_TB: [string,string,string,string,string]
    GROUPS_BS: [string,string,string]
    GROUPS_IS: [string,string]

    CURRENCY_FORMAT_WIDTH: number
}


export const config:Config = {
    FILE_LOCALE: 'data/0-masters/locale.txt',

    PATH_INPUTS: 'data/1-inputs',
    PATH_INPUTS_IMPORTED: 'data/5-imported-inputs',

    // Open Batch
    PATH_OPEN_BATCH: 'data/2-open-batch',
    FILE_OPEN_TRANSACTION_MAP: 'data/2-open-batch/transactionMap.csv',
    FILE_CLOSED_TRANSACTION_MAP: 'data/3-closed-batches/closed-transactionMap.csv',

    FILE_OPEN_DESCRIPTION_MAP: 'data/2-open-batch/unUsedDescriptionMap.csv',

    // Masters
    PATH_MASTERS: 'data/0-masters/',
    FILE_MASTER_USER_CONFIG: 'data/0-masters/locale.txt',
    FILE_MASTER_COA: 'data/0-masters/chart-of-accounts.csv',
    FILE_MASTER_DESCRIPTION_MAP: 'data/0-masters/description-map.csv',

    PATH_OPEN_REPORTS: 'data/4-0-statements-open',
    PATH_COMBO_REPORTS: 'data/4-1-statements-combo',
    PATH_CLOSED_REPORTS: 'data/4-2-statements-closed',

    // Groups for reports
    GROUPS_TB: [ 'Asset', 'Liability', 'Equity', 'Income', 'Expense'],
    GROUPS_BS: [ 'Asset', 'Liability', 'Equity'],
    GROUPS_IS: [ 'Income', 'Expense'],

    CURRENCY_FORMAT_WIDTH: 12
}