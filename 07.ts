import * as fs from 'fs'
import * as intcode from './intcode.js'
import * as assert from 'assert'

let prog = fs.readFileSync('data/07.txt', {encoding: 'utf8'})
    .split(',')
    .map((x) => parseInt(x))

let used = [false, false, false, false, false]
let best = -1e10

function rec(cnt: number, value: number) {
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
        let [output] = intcode.run(prog.slice(0), [i, value])
        rec(cnt + 1, output)
        used[i] = false
    }
}

rec(0, 0)
console.log('part 1', best)

function runLoop(modes: number[]): number {
    let ms = modes.map((mode) => {
        let m = new intcode.Machine(prog)
        m.feedInput([mode])
        return m
    })
    let input = 0
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
best = -1e10

function rec2() {
    if (modes.length == 5) {
        let value = runLoop(modes)
        best = Math.max(best, value)
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
