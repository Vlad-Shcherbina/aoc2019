import { assert } from './util.js'
import * as fs from 'fs'

let maze = fs.readFileSync('data/20.txt', {encoding: 'utf8'}).split('\n')
let last = maze.pop()
assert(last === '')

let name_to_pts = new Map<string, {x: number, y: number}[]>()

for (let y = 0; y < maze.length; y++) {
    for (let x = 1; x < maze.length; x++) {
        let name = maze[y][x - 1] + maze[y][x]
        if (/[A-Z]{2}/.test(name)) {
            let entry = name_to_pts.get(name)
            if (!entry) {
                entry = []
                name_to_pts.set(name, entry)
            }
            if (x - 2 >= 0 && maze[y][x - 2] === '.') {
                entry.push({x: x - 2, y})
            }
            if (x + 1 < maze[y].length && maze[y][x + 1] === '.') {
                entry.push({x: x + 1, y})
            }
        }
    }
}
for (let y = 1; y < maze.length; y++) {
    for (let x = 0; x < maze.length; x++) {
        let name = maze[y - 1][x] + maze[y][x]
        if (/[A-Z]{2}/.test(name)) {
            let entry = name_to_pts.get(name)
            if (!entry) {
                entry = []
                name_to_pts.set(name, entry)
            }
            if (y - 2 >= 0 && maze[y - 2][x] === '.') {
                entry.push({x, y: y - 2})
            }
            if (y + 1 < maze.length && maze[y + 1][x] === '.') {
                entry.push({x, y: y + 1})
            }
        }
    }
}

let portals = new Map<string, {x: number, y: number}>()
name_to_pts.forEach((pts) => {
    if (pts.length === 1) {
        return;
    }
    assert(pts.length === 2)
    portals.set(pts[0].x + '_' + pts[0].y, pts[1])
    portals.set(pts[1].x + '_' + pts[1].y, pts[0])
})

let [{x, y}] = name_to_pts.get('AA')!
let [goal] = name_to_pts.get('ZZ')!

let frontier = [{x, y}]
let visited = new Set<string>()
visited.add(x + '_' + y)
let dist = 0
while (frontier.length) {
    let new_frontier: {x: number, y: number}[] = []
    for (let {x, y} of frontier) {
        if (x === goal.x && y === goal.y) {
            console.log('part 1', dist)
            new_frontier = []
            break
        }
        for (let [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            let dst = { x: x + dx, y: y + dy }
            if (maze[y][x] !== '.') {
                continue
            }
            let key = dst.x + '_' + dst.y
            if (visited.has(key)) {
                continue
            }
            visited.add(key)
            new_frontier.push(dst)
        }
        let dst = portals.get(x + '_' + y)
        if (!dst) {
            continue
        }
        let key = dst.x + '_' + dst.y
        if (visited.has(key)) {
            continue
        }
        visited.add(key)
        new_frontier.push(dst)
    }
    frontier = new_frontier
    dist += 1
}
