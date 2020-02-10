import * as fs from 'fs'

let lines = fs.readFileSync('data/24.txt', {encoding: 'utf8'}).trimEnd().split('\n')

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
