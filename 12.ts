import * as fs from 'fs'
import * as assert from 'assert'

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
let vels = locs.map(() => [0, 0, 0])

for (let step = 0; step < 1000; step++) {
    locs.forEach((loc, i) => {
        for (let j = 0; j < i; j++) {
            let loc2 = locs[j]
            for (let k = 0; k < 3; k++) {
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
        for (let k = 0; k < 3; k++) {
            loc[k] += vels[i][k]
        }
    })
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
