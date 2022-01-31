import { log } from "./log"
import { Inputs, DescriptionMap } from "./schema"

export function match(inpTrxs:Inputs,descriptionMap:DescriptionMap):number {
    // we need a list of descriptions from longest to shortest
    const descriptions = Object.keys(descriptionMap).sort((a,b)=>a.length > b.length ? -1 : 1)
    let counts:{[key:string]: number} = {}

    for(const trx of inpTrxs) {
        // don't overwrite
        if(trx.crdAccount!=='') {
            continue
        }

        // If no exact matches were found, attempt using description
        for(const descr of descriptions) {
            if(trx.description.includes(descr)) {
                trx.crdAccount = descriptionMap[descr]
                if(!(descr in counts)) {
                    counts[descr] = 0
                }
                counts[descr]++
                break;
            }
        }

    }

    const matched = Object.keys(counts)
    if(matched.length > 0) {
        matched.forEach(matchDesc=>{
            log(`${counts[matchDesc]} transactions matched for: ${matchDesc}`)
        })
    }
    return matched.length
}