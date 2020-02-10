import * as fs from 'fs'
import { assert, gcd } from './util.js'

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

function pow<T>(x: T, one: T, mul: (a: T, b: T) => T, n: bigint): T {
    if (n === 0n) {
        return one
    }
    let t = pow(mul(x, x), one, mul, n / 2n)
    if (n % 2n === 1n) {
        return mul(t, x)
    } else {
        return t
    }
}

// find x, y such that a*x + b*y = gcd
function egcd(a: bigint, b: bigint): { gcd: bigint, x: bigint, y: bigint } {
    if (b === 0n) {
        return { gcd: a, x: 1n, y: 0n }
    }
    let k = a / b
    let e = egcd(b, a % b)
    return { gcd: e.gcd, x: e.y, y: e.x - k * e.y }
}

function f(lines: string[], N: bigint): Affine {
    let transform = { offset: 0n, step: 1n }

    for (let line of lines) {
        let m = null
        if (line === 'deal into new stack') {
            transform = compose(transform, { offset: -1n, step: -1n }, N)
        } else if (m = /cut (-?\d+)/.exec(line)) {
            let offset = BigInt(m[1])
            transform = compose(transform, { offset: -offset, step: 1n }, N)
        } else if (m = /deal with increment (\d+)/.exec(line)) {
            let increment = BigInt(m[1])
            transform = compose(transform, { offset: 0n, step: increment }, N)
        } else {
            assert(false, line)
        }
    }
    return transform
}

let lines = fs.readFileSync('data/22.txt', {encoding: 'utf8'}).trimEnd().split('\n')

let N = 10007n
let transform = f(lines, N)
let res = transform.step * 2019n + transform.offset
res %= N
res += N
res %= N
console.log('part 1', res.toString())

N = 119315717514047n
transform = f(lines, N)
transform = pow(
    transform,
    { offset: 0n, step: 1n},
    (a, b) => compose(a, b, N),
    101741582076661n)

let e = egcd(transform.step, N)
assert(e.gcd === 1n)
assert(e.gcd === e.x * transform.step + e.y * N)
res = (2020n - transform.offset) * e.x
res %= N
res += N
res %= N
console.log('part 2', res.toString())
