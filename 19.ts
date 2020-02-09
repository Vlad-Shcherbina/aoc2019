import * as fs from 'fs'
import * as intcode from './intcode.js'
import { assert } from './util.js'

let prog = fs.readFileSync('data/19.txt', {encoding: 'utf8'}).split(',').map(BigInt)

function probe(x: number, y: number): boolean {
    let out = intcode.run(prog, [BigInt(x), BigInt(y)])
    assert(out.length === 1)
    return !!out[0]
}

let cnt = 0
for (let y = 0; y < 50; y++) {
    let s = ''
    for (let x = 0; x < 50; x++) {
        if (probe(x, y)) {
            cnt++
            s += '*'
        } else {
            s += '.'
        }
    }
    console.log(s)
}
console.log('part 1', cnt)

let prev = new Map<number, { x1: number, x2: number }>()

console.time('part 2')
let y = 50
let x1 = 0
let x2 = 0
while (true) {
    while (!probe(x1, y)) {
        x1++
    }
    if (x2 === 0) {
        x2 = x1
    }
    while (probe(x2, y)) {
        x2++
    }
    prev.set(y, { x1, x2 })
    y += 1
    let q = prev.get(y - 100)
    if (q && q.x2 - x1 >= 100) {
        console.log('part 2', x1 * 10000 + y - 100)
        break
    }
}
console.timeEnd('part 2')
