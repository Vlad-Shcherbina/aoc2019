import * as fs from 'fs'
import * as intcode from './intcode.js'
import { assert } from './util.js'

let prog = fs.readFileSync('data/21.txt', {encoding: 'utf8'}).split(',').map(BigInt)

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
let m = new intcode.Machine(prog)
for (let ch of program) {
    m.feedInput([BigInt(ch.charCodeAt(0))])
}
// TODO: deduplicate (anchor: jbWYTVqwDjaN)
let outputs = ''
while (true) {
    let res = m.run()
    if (res.event === 'HALT') {
        console.log('HALT')
        break
    } else if (res.event === 'OUTPUT') {
        if (res.output > 127n) {
            console.log('part 1:', Number(res.output))
        } else if (res.output === 10n) {
            console.log(outputs)
            outputs = ''
        } else {
            outputs += String.fromCharCode(Number(res.output))
        }
    } else if (res.event === 'INPUT') {
        console.log('INPUT')
        break
    } else {
        let _: never = res
        assert(false)
    }
}
