import * as fs from 'fs'
import * as intcode from './intcode.js'
import { assert } from './util.js'

const NORTH = 1
const SOUTH = 2
const WEST = 3
const EAST = 4
const DELTA = [undefined, [0, -1], [0, 1], [-1, 0], [1, 0]]

function key(pos: [number, number]): string {
    return pos[0] + '_' + pos[1]
}

function bfs(start: [number, number], goal: (pos: [number, number]) => boolean): number[] | number {
    let prev = new Map<string, [number, number, number]>()
    let frontier = [start]
    prev.set(key(start), [-1, -1, -1])
    let cnt = -1
    while (frontier.length > 0) {
        let newFrontier: [number, number][] = []
        for (let u of frontier) {
            if (goal(u)) {
                let path = []
                while (u[0] != start[0] || u[1] != start[1]) {
                    let [px, py, dir] = prev.get(key(u))!
                    path.push(dir)
                    u = [px, py]
                }
                path.reverse()
                return path
            }
            for (let dir = 1; dir <= 4; dir++) {
                let delta = DELTA[dir]!
                let v: [number, number] = [u[0] + delta[0], u[1] + delta[1]]
                if (walls.has(key(v)) || prev.has(key(v))) {
                    continue
                }
                prev.set(key(v), [u[0], u[1], dir])
                newFrontier.push(v)
            }
        }
        frontier = newFrontier
        cnt += 1
    }
    return cnt
}

let prog = fs.readFileSync('data/15.txt', {encoding: 'utf8'})
    .split(',')
    .map(BigInt)
let m = new intcode.Machine(prog)

let visited = new Map<string, [number, number]>()
let walls = new Map<string, [number, number]>()
let pos: [number, number] = [0, 0]
visited.set(key(pos), pos)

let oxygen_tank_pos = null

while (true) {
    let path = bfs(pos, (pos =>
        !visited.has(key(pos)) && !walls.has(key(pos))
    ))
    if (!Array.isArray(path)) {
        break
    }
    for (let dir of path) {
        let delta = DELTA[dir]!
        let new_pos: [number, number] = [pos[0] + delta[0], pos[1] + delta[1]]

        let res = m.run()
        assert(res.event === 'INPUT')
        m.feedInput([BigInt(dir)])

        res = m.run()
        assert(res.event === 'OUTPUT')
        if (res.output === 0n) {
            walls.set(key(new_pos), new_pos)
            break
        } else if (res.output === 1n) {
            pos = new_pos
            visited.set(key(pos), pos)
        } else if (res.output === 2n) {
            pos = new_pos
            visited.set(key(pos), pos)
            oxygen_tank_pos = pos
        } else {
            assert(false)
        }
    }
}

let min_x = 1e10
let max_x = -1e10
let min_y = 1e10
let max_y = -1e10
for (let zzz of [visited, walls]) {
    for (let [xx, yy] of zzz.values()) {
        min_x = Math.min(min_x, xx)
        min_y = Math.min(min_y, yy)
        max_x = Math.max(max_x, xx)
        max_y = Math.max(max_y, yy)
    }
}
for (let i = min_y; i <= max_y; i++) {
    let s = ''
    for (let j = min_x; j <= max_x; j++) {
        let ji: [number, number] = [j, i]
        s += ' '
        if (pos[0] === j && pos[1] === i) {
            s += 'D'
        } else if (walls.has(key(ji))) {
            s += '#'
        } else if (visited.has(key(ji))) {
            s += '.'
        } else {
            s += ' '
        }
    }
    console.log(s)
}

console.log(oxygen_tank_pos)
let path = bfs(oxygen_tank_pos!, (pos) => pos[0] === 0 && pos[1] === 0)!
assert(Array.isArray(path))
console.log('part 1', path.length)

let t = bfs(oxygen_tank_pos!, (pos) => false)
console.log('part 2', t)