import { addToDo } from "./todo"
import { config} from './config'
import { log } from './log'
import { Inputs, DescriptionMap, TransactionMap } from "./schema"

export function matchLogic(
    inpTrxs:Inputs,
    usrDescriptionMap:DescriptionMap,
    usrTransactionMap:TransactionMap
){
    log(1,"Attempting to map transactions from transaction map, manual input, or descriptions")

    // we need a list of descriptions from longest to shortest
    let descriptionsMap = {}
    usrDescriptionMap.forEach(descr=>descriptionsMap[descr[1]] = descr[0])
    const descriptions = Object.keys(descriptionsMap).sort((a,b)=>a.length > b.length ? -1 : 1)

    for(const trx of inpTrxs) {
        trx.computedOffset = ''
        trx.computedReason = ''
        trx.computedDetail = ''

        // If there is an exact match in transaction map, use that
        // Transaction Map ALWAYS WINS!
        const key = `${trx.inpAccount}-${trx.date}-${trx.description}-${Math.abs(trx.amount)}`
        if(key in usrTransactionMap) {
            trx.computedOffset = usrTransactionMap[key]
            trx.computedReason = trx.inpOffset === '' ? 'Transaction Match' : 'Transaction overrides manual'
            trx.computedDetail = key
            continue;
        }

        // If there is a match on the input, use that, because the
        // user typed that in themselves so they obviously know what they are doing
        if(trx.inpOffset !== '') {
            trx.computedOffset = trx.inpOffset
            trx.computedReason = 'Manual Offset'
            trx.computedDetail = ''
            continue;
        }

        // If no exact matches were found, attempt using description
        for(const descr of descriptions) {
            if(trx.description.includes(descr)) {
                trx.computedOffset = descriptionsMap[descr]
                trx.computedReason = "Description includes"
                trx.computedDetail = descr
                break;
            }
        }
    }

    const unmatchedCount= inpTrxs.filter(trx=>trx.computedOffset==='').length
    if(unmatchedCount > 0) {
        addToDo(`${unmatchedCount} transactions are not yet mapped`)
        addToDo(`FYI: map multiple transactions by description in ${config.PATH_DESCRIPTON_MAP}`)
        addToDo(`FYI: map indidividual transactions in ${config.PATH_TRANSACTION_MAP}`)
    }

}