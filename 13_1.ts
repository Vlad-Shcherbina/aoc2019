import * as fs from 'fs'
import * as assert from 'assert'
import * as intcode from './intcode.js'

let prog = fs.readFileSync('data/13.txt', {encoding: 'utf8'}).split(',')
    .map((x) => BigInt(x))

let outputs = intcode.run(prog, [])
assert.strictEqual(outputs.length % 3, 0)
let screen = new Map<string, [bigint, bigint, bigint]>()
let cnt = 0
for (let i = 0; i < outputs.length; i += 3) {
    if (outputs[i + 2] === 2n) {
        cnt++
    }
}
console.log('part 1', cnt)
