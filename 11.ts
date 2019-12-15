// To run:
//    node --harmony 11
// Otherwise node complains about optional chaining operator (?.).

import * as fs from 'fs'
import * as intcode from './intcode.js'
import * as assert from 'assert'

function run(prog: bigint[], start_color: 0n | 1n): Map<string, [number, number, bigint]> {

    let x = 0
    let y = 0
    let dx = 0
    let dy = -1
    let painted = new Map<string, [number, number, bigint]>()
    painted.set('0_0', [0, 0, start_color])

    let m = new intcode.Machine(prog)
    while (true) {
        let res = m.run()
        if (res.event === 'HALT') {
            break
        }
        if (res.event !== 'INPUT') {
            assert.fail('' + res)
        }
        if (painted.get(x + '_' + y)?.[2]) {
            m.feedInput([1n])
        } else {
            m.feedInput([0n])
        }

        res = m.run()
        if (res.event !== 'OUTPUT') {
            assert.fail('' + res)
        }
        assert.ok(res.output === 0n || res.output === 1n)
        painted.set(x + '_' + y, [x, y, res.output])

        res = m.run()
        if (res.event !== 'OUTPUT') {
            assert.fail('' + res)
        }
        assert.ok(res.output === 0n || res.output === 1n)
        let t = dy
        dy = -dx
        dx = t
        if (res.output) {
            dx = -dx
            dy = -dy
        }
        x += dx
        y += dy
    }
    return painted
}

let prog = fs.readFileSync('data/11.txt', {encoding: 'utf8'})
    .split(',').map((x) => BigInt(x))

console.log('part 1', run(prog, 0n).size)

console.log('part 2')
let painted = run(prog, 1n)
let min_x = 1e10
let max_x = -1e10
let min_y = 1e10
let max_y = -1e10
for (let [x, y, color] of painted.values()) {
    min_x = Math.min(min_x, x)
    min_y = Math.min(min_y, y)
    max_x = Math.max(max_x, x)
    max_y = Math.max(max_y, y)
}
for (let y = min_y; y <= max_y; y++) {
    let s = ''
    for (let x = min_x; x <= max_x; x++) {
        if (painted.get(x + '_' + y)?.[2]) {
            s += ' *'
        } else {
            s += '  '
        }
    }
    console.log(s)
}
