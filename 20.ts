import { assert } from './util.js'
import * as fs from 'fs'

let maze = fs.readFileSync('data/20.txt', {encoding: 'utf8'})
    .trimEnd().split('\n').map(line => line.trimEnd())

let name_to_pts = new Map<string, {x: number, y: number, outer: boolean}[]>()

for (let y = 0; y < maze.length; y++) {
    for (let x = 1; x < maze[y].length; x++) {
        let name = maze[y][x - 1] + maze[y][x]
        if (/[A-Z]{2}/.test(name)) {
            let entry = name_to_pts.get(name)
            if (!entry) {
                entry = []
                name_to_pts.set(name, entry)
            }
            let outer = x - 2 === -1 || x + 1 === maze[y].length
            if (x - 2 >= 0 && maze[y][x - 2] === '.') {
                entry.push({x: x - 2, y, outer})
            }
            if (x + 1 < maze[y].length && maze[y][x + 1] === '.') {
                entry.push({x: x + 1, y, outer})
            }
        }
    }
}
for (let y = 1; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
        let name = maze[y - 1][x] + maze[y][x]
        if (/[A-Z]{2}/.test(name)) {
            let entry = name_to_pts.get(name)
            if (!entry) {
                entry = []
                name_to_pts.set(name, entry)
            }
            let outer = y - 2 === -1 || y + 1 === maze.length
            if (y - 2 >= 0 && maze[y - 2][x] === '.') {
                entry.push({x, y: y - 2, outer})
            }
            if (y + 1 < maze.length && maze[y + 1][x] === '.') {
                entry.push({x, y: y + 1, outer})
            }
        }
    }
}

let portals = new Map<string, {x: number, y: number}>()
let portals_inside = new Map<string, {x: number, y: number, name: string}>()
let portals_outside = new Map<string, {x: number, y: number, name: string}>()
name_to_pts.forEach((pts, name) => {
    if (pts.length === 1) {
        assert(name === 'AA' || name === 'ZZ', name)
        return
    }
    assert(pts.length === 2)
    if (!pts[0].outer) {
        pts.reverse()
    }
    assert(pts[0].outer)
    assert(!pts[1].outer)
    portals.set(pts[0].x + '_' + pts[0].y, pts[1])
    portals.set(pts[1].x + '_' + pts[1].y, pts[0])
    portals_outside.set(pts[0].x + '_' + pts[0].y, {...pts[1], name})
    portals_inside.set(pts[1].x + '_' + pts[1].y, {...pts[0], name})
})

let [start] = name_to_pts.get('AA')!
let [goal] = name_to_pts.get('ZZ')!

function part1() {
    let frontier = [{x: start.x, y: start.y}]
    let visited = new Set<string>()
    visited.add(start.x + '_' + start.y)
    let dist = 0
    while (frontier.length) {
        let new_frontier: {x: number, y: number}[] = []
        for (let {x, y} of frontier) {
            if (x === goal.x && y === goal.y) {
                return dist
            }
            for (let [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                let dst = { x: x + dx, y: y + dy }
                if (maze[dst.y][dst.x] !== '.') {
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
    assert(false)
}
console.log('part 1', part1())

function part2() {
    let frontier = [{x: start.x, y: start.y, depth: 0}]
    let visited = new Set([start.x + '_' + start.y + '_' + 0])
    let dist = 0
    while (frontier.length) {
        let new_frontier: { x: number, y: number, depth: number }[] = []
        for (let q of frontier) {
            let {x, y, depth} = q
            if (x === goal.x && y === goal.y && depth === 0) {
                return dist
            }
            for (let [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                let dst = { x: x + dx, y: y + dy, depth}
                if (maze[dst.y][dst.x] !== '.') {
                    continue
                }
                let key = dst.x + '_' + dst.y + '_' + dst.depth
                if (!visited.has(key)) {
                    visited.add(key)
                    new_frontier.push(dst)
                }
            }
            let dst = portals_inside.get(x + '_' + y)
            if (dst) {
                let dst2 = {...dst, depth: depth + 1}
                let key = dst2.x + '_' + dst2.y + '_' + dst2.depth
                if (!visited.has(key)) {
                    visited.add(key)
                    new_frontier.push(dst2)
                }
            }
            dst = portals_outside.get(x + '_' + y)
            if (depth > 0 && dst) {
                let dst2 = {...dst, depth: depth - 1}
                let key = dst2.x + '_' + dst2.y + '_' + dst2.depth
                if (!visited.has(key)) {
                    visited.add(key)
                    new_frontier.push(dst2)
                }
            }
        }
        frontier = new_frontier
        dist += 1
    }
    assert(false)
}
console.log('part 2', part2())
