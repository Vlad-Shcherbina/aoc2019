import * as fs from 'fs'
import * as child_process from 'child_process'
import { assert } from './util.js'

interface Pt {
    x: number
    y: number
}

function find(ch: string, maze: string[]): Pt | null {
    for (let y = 0; y < maze.length; y++) {
        let x = maze[y].indexOf(ch)
        if (x != -1) {
            return {x: x, y: y}
        }
    }
    return null
}

function bfs(start: Pt, maze: string[]): Map<string, number> {
    let frontier = [start]
    let visited = new Set()
    visited.add(start.x + '_' + start.y)
    let distance = 0
    let result = new Map<string, number>()
    while (frontier.length) {
        distance++
        let newFrontier: Pt[] = []
        for (let u of frontier) {
            for (let [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                let v = {x: u.x + dx, y: u.y + dy}
                let c = maze[v.y].charAt(v.x)
                let key = v.x + '_' + v.y
                if (visited.has(key)) {
                    continue
                }
                if (c === '.') {
                    visited.add(key)
                    newFrontier.push(v)
                } else if (c === '#') {
                } else {
                    result.set(c, distance)
                }
            }
        }
        frontier = newFrontier
    }
    return result
}


let maze = fs.readFileSync('data/18.txt', {encoding: 'utf8'})
    .trimRight().split('\n')

let start = find('@', maze)!

let num_keys = 0
let graph = new Map<string, Map<string, number>>()
maze.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
        if (row[x] === '.' || row[x] === '#') {
            continue
        }
        let ns = bfs({x, y}, maze)
        graph.set(row[x], ns)
        if (row[x] !== '@' && row[x].toLowerCase() === row[x]) {
            num_keys++
        }
    }
})

/*let dot = ['graph {']
graph.forEach((_, k) => {
    dot.push(`  "${k}" [shape=circle];`)
})
graph.forEach((ns, u) => {
    ns.forEach((dist, v) => {
        if (u <= v) {
            dot.push(`  "${u}" -- "${v}" [label=${dist}];`)
        }
    })
})
dot.push('}')
fs.writeFileSync('tmp.dot', dot.join('\n'))
let p = child_process.spawnSync('dot', ['-Tpng', 'tmp.dot', '-o', 'tmp.png'])
console.log(p)*/

interface State {
    pos: string,
    keys: string[],  // sorted
}

function state_key(state: State) {
    return state.pos + '_' + state.keys.join('')
}

function neighbors(state: State) {
    let ns: [State, number][] = []
    let q = graph.get(state.pos)
    assert(q !== undefined)
    q.forEach((dist, v) => {
        if (v !== '@' && v.toUpperCase() === v) {
            if (!state.keys.some(k => k.toUpperCase() === v)) {
                return
            }
        }
        let {keys} = state
        if (v !== '@' && v.toLowerCase() === v) {
            if (!keys.includes(v)) {
                keys = keys.slice(0)
                keys.push(v)
                keys.sort()
            }
        }
        ns.push([
            { pos: v, keys },
            dist,
        ])
    })
    return ns
}

let start_state: State = { pos: '@', keys: [] }
let frontier = new Map<string, { dist: number, state: State }>()
frontier.set(state_key(start_state), { state: start_state, dist: 0 })
let visited = new Set<string>()

while (true) {
    let min_dist = Infinity
    let min_state: State | null = null as any
    frontier.forEach(({ dist, state }) => {
        if (dist < min_dist) {
            min_dist = dist
            min_state = state
        }
    })
    assert(min_state !== null)
    if (min_state.keys.length === num_keys) {
        console.log('part 1:', min_dist)
        break
    }
    if (Math.random() < 1e-4) {
        console.log(min_dist, min_state.keys.join(''), '...')
    }
    let min_key = state_key(min_state)
    frontier.delete(min_key)
    visited.add(min_key)
    for (let [s, d] of neighbors(min_state)) {
        let k = state_key(s)
        if (visited.has(k)) {
            continue
        }
        let entry = frontier.get(k)
        if (entry === undefined) {
            entry = { dist: Infinity, state: s}
            frontier.set(k, entry)
        }
        entry.dist = Math.min(entry.dist, min_dist + d)
    }
}
