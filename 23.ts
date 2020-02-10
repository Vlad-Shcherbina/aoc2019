import * as fs from 'fs'
import * as intcode from './intcode.js'
import { assert } from './util.js'

interface State {
    m: intcode.Machine
    queue: bigint[]
    output: bigint[]
}

let prog = fs.readFileSync('data/23.txt', {encoding: 'utf8'}).split(',').map(BigInt)

let states: State[] = Array.from(new Array(50).keys()).map(i => {
    let m = new intcode.Machine(prog)
    m.feedInput([BigInt(i)])
    return { m, queue: [], output: [] }
})

outer:
while (true) {
    for (let s of states) {
        let res = s.m.run(1)
        if (res.event === 'INPUT') {
            assert(res.executed === 0)
            if (s.queue.length) {
                assert(s.queue.length >= 2)
                let x = s.queue.slice(0, 2)
                s.queue = s.queue.slice(2)
                s.m.feedInput(x)
            } else {
                s.m.feedInput([-1n])
            }
            res = s.m.run(1)
            assert(res.event !== 'INPUT')
        }
        switch (res.event) {
            case 'HALT': break
            case 'LIMIT': break
            case 'OUTPUT': {
                s.output.push(res.output)
                if (s.output.length === 3) {
                    if (s.output[0] === 255n) {
                        console.log('part 1', Number(s.output[2]))
                        break outer
                    }
                    let recepient = states[Number(s.output[0])]
                    recepient.queue.push(...s.output.slice(1))
                    s.output = []
                }
                break
            }
        }
    }
}
