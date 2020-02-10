import * as fs from 'fs'
import * as intcode from './intcode.js'
import { assert } from './util.js'

function run_ascii(prog: bigint[], input: string): number | null {
    let m = new intcode.Machine(prog)
    for (let ch of input) {
        m.feedInput([BigInt(ch.charCodeAt(0))])
    }
    // TODO: deduplicate (anchor: jbWYTVqwDjaN)
    let outputs = ''
    while (true) {
        let res = m.run()
        if (res.event === 'HALT') {
            console.log('HALT')
            return null
        } else if (res.event === 'OUTPUT') {
            if (res.output > 127n) {
                return Number(res.output)
            } else if (res.output === 10n) {
                console.log(outputs)
                outputs = ''
            } else {
                outputs += String.fromCharCode(Number(res.output))
            }
        } else if (res.event === 'INPUT') {
            console.log('INPUT')
            assert(false)
        } else {
            let _: never = res
            assert(false)
        }
    }
}

let prog = fs.readFileSync('data/21.txt', {encoding: 'utf8'}).split(',').map(BigInt)

// J = not (A and B and C) and D
let program = `\
NOT J T
OR T J
AND A J
AND B J
AND C J
NOT J J
AND D J
WALK
`
console.log('part 1', run_ascii(prog, program))

// J = not (A and B and C) and D and (E or H)
program = `\
NOT J T
OR T J
AND A J
AND B J
AND C J
NOT J J
AND D J
NOT E T
NOT T T
OR H T
AND T J
RUN
`
console.log('part 2', run_ascii(prog, program))
