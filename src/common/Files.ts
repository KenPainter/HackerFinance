/**
 * Files.ts
 * This program is part of Hacker Finance
 * 
 * Common infrastructure for accessing file system
 */
import * as fs from 'fs'
import * as path from 'path'

import { log, logConclusion, logGroup,logGroupEnd } from './log'

// Constants for data paths
const TOP = 'data'
const PATHS = {
    masters: '0-masters',
    inputs: '1-inputs',
    open: '2-open',
    closed: '3-closed',
    statementsOpen: '4-0-statements-open',
    statementsCombo: '4-1-statements-combo',
    statementsClosed: '4-2-statements-closed',
    imported: '5-imported-inputs'
}

const makeDir = (dir:string)=>{
    if(!fs.existsSync(dir)) {
        log(dir," - does not exist, creating")
        fs.mkdirSync(dir)
    }
    else {
        log(dir," - already exists")
    }
}

export class Files {
    // where to find root, and its current value
    private rootSpec = path.join(TOP,'root.txt')
    private root = ''

    // This is normally called by scripts 
    public init() {
        if(!fs.existsSync(TOP)) {
            logConclusion("Looks like this is the very first time!")
            log("I will create a dataset called 'default' and set it as root")
            this.setRoot('default')
        }
        this.root = fs.readFileSync(this.rootSpec,'utf8')
    }
    public setRoot(newRoot:string) {
        this.root = newRoot
        logGroup(`Setting root to: ${newRoot}`)
        makeDir(TOP)
        makeDir(path.join(TOP,this.root))
        for(const dir of Object.values(PATHS)) {
            makeDir(path.join(TOP,this.root,dir))
        }

        log(`Saving root '${this.root}' to ${this.rootSpec}`)
        fs.writeFileSync(this.rootSpec,this.root)

        logGroupEnd(`Setting root to: ${newRoot}`)
    }
    
    // tell scripts which directories to use
    public pathMasters   = () => path.join(TOP,this.root,PATHS.masters)
    public pathInputs    = () => path.join(TOP,this.root,PATHS.inputs)
    public pathOpen      = () => path.join(TOP,this.root,PATHS.open)
    public pathClosed    = () => path.join(TOP,this.root,PATHS.closed)
    public pathImported  = () => path.join(TOP,this.root,PATHS.imported)
    public pathStmOpen   = () => path.join(TOP,this.root,PATHS.statementsOpen)
    public pathStmCombo  = () => path.join(TOP,this.root,PATHS.statementsCombo)
    public pathStmClosed = () => path.join(TOP,this.root,PATHS.statementsClosed)


}
