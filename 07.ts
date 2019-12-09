import * as fs from 'fs'
import * as intcode from './intcode.js'
import * as assert from 'assert'

let prog = fs.readFileSync('data/07.txt', {encoding: 'utf8'})
    .split(',')
    .map((x) => BigInt(x))

let used = [false, false, false, false, false]
let best = -1000000000n

function rec(cnt: number, value: bigint) {
    if (cnt == used.length) {
        if (value > best) {
            best = value
        }
        return
    }
    for (let i = 0; i < used.length; i++) {
        if (used[i]) {
            continue
        }
        used[i] = true
        let [output] = intcode.run(prog.slice(0), [BigInt(i), value])
        rec(cnt + 1, output)
        used[i] = false
    }
}

rec(0, 0n)
console.log('part 1', best)

function runLoop(modes: number[]): bigint {
    let ms = modes.map((mode) => {
        let m = new intcode.Machine(prog)
        m.feedInput([BigInt(mode)])
        return m
    })
    let input = 0n
    while (true) {
        for (let m of ms) {
            m.feedInput([input])
            let res = m.run()
            if (res.event == 'OUTPUT') {
                input = res.output
            } else {
                assert.fail(`${res}`)
            }
        }
        let res = ms[ms.length - 1].run()
        if (res.event == 'HALT') {
            return input
        } else if (res.event == 'INPUT') {
            continue
        } else if (res.event == 'OUTPUT') {
            assert.fail(`${res}`)
        } else {
            let _: never = res
        }
    }
}

let modes: number[] = []
best = -1000000000n

function rec2() {
    if (modes.length == 5) {
        let value = runLoop(modes)
        if (value > best) {
            best = value;
        }
        return
    }
    for (let i = 5; i <= 9; i++) {
        if (modes.includes(i)) {
            continue
        }
        modes.push(i)
        rec2()
        modes.pop()
    }
}

rec2()
console.log('part 2', best)
