import * as fs from 'fs'
import { setupMaster } from 'cluster'

function fft(xs: number[]): number[] {
    let cum = [0]
    let s = 0
    for (let x of xs) {
        cum.push(s += x)
    }
    let result = []
    for (let i = 1; i <= xs.length; i++) {
        let s = 0
        let q = 4 * i - 1
        while (q <= xs.length) {
            s += cum[q - 2 * i] - cum[q - 3 * i]
            s -= cum[q] - cum[q - i]
            q += 4 * i
        }
        s += cum[Math.min(q - 2 * i, xs.length)] - cum[Math.min(q - 3 * i, xs.length)]
        s -= cum[Math.min(q, xs.length)] - cum[Math.min(q - i, xs.length)]
        result.push(Math.abs(s % 10))
    }
    return result
}

let input = fs.readFileSync('data/16.txt', {encoding: 'utf8'}).trimRight()
let data = []
for (let i = 0; i < input.length; i++) {
    data.push(parseInt(input.charAt(i)))
}

let short = data
for (let step = 0; step < 100; step++) {
    short = fft(short)
}
console.log('part 1', short.slice(0, 8).join(''))

let full: number[] = []
for (let i = 0; i < 10000; i++) {
    full.push(...data)
}
let offset = parseInt(full.slice(0, 7).join(''))
let start = +new Date()
for (let step = 0; step < 100; step++) {
    full = fft(full)
    let t = (+new Date() - start) / 1000
    console.log(`${step + 1}%, ${(t).toFixed(1)}s elapsed, ${(t * (100 - step - 1) / (step + 1)).toFixed(1)}s remaining...`)
}
console.log('part 2', full.slice(offset, offset + 8).join(''))
