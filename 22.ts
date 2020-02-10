import * as fs from 'fs'
import { assert } from './util.js'

interface Affine {
    offset: bigint
    step: bigint
}

function compose(a: Affine, b: Affine, m: bigint): Affine {
    return {
        offset: (a.offset * b.step + b.offset) % m,
        step: a.step * b.step % m
    }
}

const N = 10007n

let lines = fs.readFileSync('data/22.txt', {encoding: 'utf8'}).trimEnd().split('\n')
console.log(lines)

let transform = { offset: 0n, step: 1n }

for (let line of lines) {
    let m = null
    if (line === 'deal into new stack') {
        console.log('deal into new stack')
        transform = compose(transform, { offset: -1n, step: -1n }, N)
    } else if (m = /cut (-?\d+)/.exec(line)) {
        let offset = BigInt(m[1])
        console.log('cut', offset)
        transform = compose(transform, { offset: -offset, step: 1n }, N)
    } else if (m = /deal with increment (\d+)/.exec(line)) {
        let increment = BigInt(m[1])
        console.log('deal with increment', increment)
        transform = compose(transform, { offset: 0n, step: increment }, N)
    } else {
        assert(false, line)
    }
}

console.log('part 1', ((transform.step * 2019n + transform.offset) % N + N) % N)
