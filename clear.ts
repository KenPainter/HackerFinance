import { loadTransactionMap, replaceTransactionMap } from "./src/transactionMap";
import { Inputs } from './src/schema'

const trxs:Inputs = loadTransactionMap()
trxs.forEach(trx=>{
    trx.crdAccount = ''
})
replaceTransactionMap(trxs)