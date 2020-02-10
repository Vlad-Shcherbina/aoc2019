import * as fs from 'fs'
import { assert } from './util.js'

let lines = fs.readFileSync('data/24.txt', {encoding: 'utf8'}).trimEnd().split('\n')

{  // part 1
    let state = lines.map(line => ['.', ...Array.from(line), '.'])
    state = [new Array(7).fill('.'), ...state, new Array(7).fill('.')]

    let seen = new Set<string>()
    while (true) {
        let key = state.map(row => row.join(' ')).join('\n')
        if (seen.has(key)) {
            console.log(key)
            break
        }
        seen.add(key)
        let new_state = state.map(row => row.slice(0))
        for (let i = 1; i <= 5; i++) {
            for (let j = 1; j <=5; j++) {
                let n =
                    +(state[i][j - 1] === '#') +
                    +(state[i][j + 1] === '#') +
                    +(state[i - 1][j] === '#') +
                    +(state[i + 1][j] === '#')
                if (state[i][j] === '#' && n !== 1) {
                    new_state[i][j] = '.'
                }
                if (state[i][j] === '.' && (n === 1 || n ===2)) {
                    new_state[i][j] = '#'
                }
            }
        }
        state = new_state
    }

    let biodiversity = 0
    let k = 0
    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <=5; j++) {
            if (state[i][j] === '#') {
                biodiversity += 1 << k
            }
            k += 1
        }
    }
    console.log('part 1', biodiversity)
}

function* adj(i: number, j: number, level: number): Generator<[number, number, number]> {
    assert(i !== 2 || j !== 2)
    for (let [di, dj] of [[1, 0], [-1, 0], [0, -1], [0, 1]]) {
        let i2 = i + di
        let j2 = j + dj
        if (i2 === 2 && j2 === 2) {
            if (di === 0) {
                for (let i = 0; i < 5; i++) {
                    yield [i, dj > 0 ? 0 : 4, level + 1]
                }
            } else {
                for (let j = 0; j < 5; j++) {
                    yield [di > 0 ? 0 : 4, j, level + 1]
                }
            }
        } else if (0 <= i2 && i2 < 5 && 0 <= j2 && j2 < 5) {
            yield [i2, j2, level]
        } else {
            yield [2 + di, 2 + dj, level - 1]
        }
    }
}

console.time('part 2')
let bugs = new Map<string, [number, number, number]>()
lines.forEach((row, i) => {
    Array.from(row).forEach((c, j) => {
        if (c === '#') {
            bugs.set(i + '_' + j + '_' + 0, [i, j, 0])
        }
    })
})

for (let t = 0; t < 200; t++) {
    assert(bugs.size !== 0)
    let levels = Array.from(bugs).map(([_, [i, j, level]]) => level)
    let min_level = Math.min(...levels)
    let max_level = Math.max(...levels)

    let new_bugs = new Map<string, [number, number, number]>()
    for (let level = min_level - 1; level <= max_level + 1; level++) {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (i === 2 && j === 2) {
                    continue
                }
                let n = 0
                for (let [ii, jj, vv] of adj(i, j, level)) {
                    n += +bugs.has(ii + '_' + jj + '_' + vv)
                }
                let key = i + '_' + j + '_' + level
                if (bugs.has(key)) {
                    if (n === 1) {
                        new_bugs.set(key, [i, j, level])
                    }
                } else {
                    if (n === 1 || n === 2) {
                        new_bugs.set(key, [i, j, level])
                    }
                }
            }
        }
    }
    bugs = new_bugs
}
console.log('part 2', bugs.size)
console.timeEnd('part 2')
