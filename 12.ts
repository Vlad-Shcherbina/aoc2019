import * as fs from 'fs'
import * as assert from 'assert'
import * as util from './util.js'

function simulate(dim: number, locs: number[][], vels: number[][]) {
    assert.strictEqual(locs.length, vels.length)
    locs.forEach((loc, i) => {
        for (let j = 0; j < i; j++) {
            let loc2 = locs[j]
            for (let k = 0; k < dim; k++) {
                if (loc[k] < loc2[k]) {
                    vels[i][k] += 1
                    vels[j][k] -= 1
                } else if (loc[k] > loc2[k]) {
                    vels[i][k] -= 1
                    vels[j][k] += 1
                }
            }
        }
    })
    locs.forEach((loc, i) => {
        assert.strictEqual(loc.length, dim)
        assert.strictEqual(vels[i].length, dim)
        for (let k = 0; k < dim; k++) {
            loc[k] += vels[i][k]
        }
    })
}

let locs =
    fs.readFileSync('data/12.txt', {encoding: 'utf8'})
    .trimRight().split('\n')
    .map((line) => {
        let m = line.match(/^<x=(-?\d+), y=(-?\d+), z=(-?\d+)>$/)
        if (!m) {
            assert.fail(line)
        }
        return [ parseInt(m[1]), parseInt(m[2]), parseInt(m[3]) ]
    })

let period = 1
for (let k = 0; k < 3; k++) {
    let locs_proj = locs.map((loc) => [loc[k]])
    let vels_proj = locs.map((loc) => [0])
    let seen = new Map<string, number>()
    let period_proj: number;
    for (let step = 0; ; step++) {
        let key = JSON.stringify(locs_proj) + '\n' + JSON.stringify(vels_proj)
        if (seen.has(key)) {
            period_proj = step - seen.get(key)!
            break
        } else {
            seen.set(key, step)
        }
        simulate(1, locs_proj, vels_proj)
    }
    period *= period_proj / util.gcd(period, period_proj)
}
console.log('part 2', period)

let vels = locs.map(() => [0, 0, 0])
for (let step = 0; step < 1000; step++) {
    simulate(3, locs, vels)
}

let energy = 0
locs.forEach((loc, i) => {
    let potential = 0
    let kinetic = 0
    for (let k = 0; k < 3; k++) {
        potential += Math.abs(loc[k])
        kinetic += Math.abs(vels[i][k])
    }
    energy += potential * kinetic
})
console.log('part 1', energy)
