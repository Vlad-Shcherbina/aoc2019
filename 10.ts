import * as fs from 'fs'
import * as assert from 'assert'

function gcd(a: number, b: number): number {
    assert.strictEqual(a, Math.floor(a))
    assert.strictEqual(b, Math.floor(b))
    assert.ok(a >= 0 && b >= 0)
    while (b > 0) {
        let t = a % b
        a = b
        b = t
    }
    return a
}

let rows = fs.readFileSync('data/10.txt', { encoding: 'utf8' }).trimRight().split('\n')

let asteroids: [number, number][] = []
let h = rows.length
let w = rows[0].length
rows.forEach((row, i) => {
    assert.strictEqual(row.length, w)
    Array.from(row).forEach((c, j) => {
        if (c === '#') {
            asteroids.push([j, i])
        }
    })
})

let best = 0
let station_x = 0
let station_y = 0
for (let [sx, sy] of asteroids) {
    let visible = new Set(asteroids.map(([x, y]) => y + '_' + x))
    let res = visible.delete(sy + '_' + sx)
    assert.ok(res)
    for (let [x, y] of asteroids.values()) {
        if (!visible.has(y + '_' + x)) {
            continue
        }
        let dx = x - sx
        let dy = y - sy
        let d = gcd(Math.abs(dx), Math.abs(dy))
        dx /= d
        dy /= d
        while (true) {
            x += dx
            y += dy
            if (x < 0 || y < 0 || x >= w || y >= w) {
                break
            }
            visible.delete(y + '_' + x)
        }
    }
    if (visible.size > best) {
        best = visible.size
        station_x = sx
        station_y = sy
    }
}
console.log('part 1', best)

let angle_to_asteroids = new Map<number, [number, number][]>()
for (let [x, y] of asteroids) {
    if (x === station_x && y === station_y) {
        continue
    }
    let angle = Math.atan2(station_x - x, y - station_y)
    if (angle === Math.PI) {
        angle = -Math.PI
    }
    if (!angle_to_asteroids.has(angle)) {
        angle_to_asteroids.set(angle, [])
    }
    angle_to_asteroids.get(angle)!.push([x, y])
}

let a_groups = Array.from(angle_to_asteroids)
a_groups.sort(([a1, _], [a2, _2]) => a1 - a2)
let groups = a_groups.map(([_, group]) => group)
let dist2 = (x:number, y:number) =>
    (x - station_x) * (x - station_x) + (y - station_y) * (y - station_y)
groups.forEach((group) => group.sort(([x1, y1], [x2, y2]) => {
    return dist2(x2, y2) - dist2(x1, y1)
}))

for (let i = 0; i < 200; i++) {
    let group = groups[0]
    groups = groups.slice(1)
    let [x, y] = group.pop()!
    if (i + 1 === 200) {
        console.log('part 2', x * 100 + y)
    }
    if (group.length > 0) {
        groups.push(group)
    }
}
