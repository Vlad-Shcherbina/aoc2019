import * as fs from 'fs'
import * as intcode from './intcode.js'

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
