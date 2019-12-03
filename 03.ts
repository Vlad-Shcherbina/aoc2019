import * as fs from 'fs'

const dir_to_deltas: {[dir: string]: [number, number]} = {
    R: [1, 0],
    U: [0, 1],
    L: [-1, 0],
    D: [0, -1],
}

function* traceWire(s: string): Generator<[number, [number, number]]> {
    let [x, y, cnt] = [0, 0, 0]
    for (let part of s.split(',')) {
        let dir = part.charAt(0)
        let [dx, dy] = dir_to_deltas[dir]
        let dist = parseInt(part.slice(1))
        for (let i = 0; i < dist; i++) {
            x += dx
            y += dy
            cnt += 1
            yield [cnt, [x, y]]
        }
    }
}

let [line1, line2] = fs.readFileSync('data/03.txt', {encoding: 'utf-8'}).split('\n')
let wire1 = new Map(Array.from(traceWire(line1), ([n, [x, y]]) => [x + '_' + y, n]))
let minDist = 1e10
let minSteps = 1e10
for (let [d, [x, y]] of traceWire(line2)) {
    let n = wire1.get(x + '_' + y)
    if (n !== undefined) {
        minDist = Math.min(minDist, Math.abs(x) + Math.abs(y))
        minSteps = Math.min(minSteps, n + d)
    }
}
console.log('part 1', minDist)
console.log('part 2', minSteps)
