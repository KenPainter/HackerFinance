import { Inputs, DescriptionMap } from "./schema"

export function match(inpTrxs:Inputs,descriptionMap:DescriptionMap) {
    // we need a list of descriptions from longest to shortest
    const descriptions = Object.keys(descriptionMap).sort((a,b)=>a.length > b.length ? -1 : 1)

    for(const trx of inpTrxs) {
        // don't overwrite
        if(trx.crdAccount!=='') {
            continue
        }

        // If no exact matches were found, attempt using description
        for(const descr of descriptions) {
            if(trx.description.includes(descr)) {
                trx.crdAccount = descriptionMap[descr]
                break;
            }
        }
    }
}