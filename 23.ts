import * as fs from 'fs'
import * as intcode from './intcode.js'
import { assert } from './util.js'

interface State {
    m: intcode.Machine
    queue: bigint[]
    output: bigint[]
    waiting: number
}

let prog = fs.readFileSync('data/23.txt', {encoding: 'utf8'}).split(',').map(BigInt)

let states: State[] = Array.from(new Array(50).keys()).map(i => {
    let m = new intcode.Machine(prog)
    m.feedInput([BigInt(i)])
    return { m, queue: [], output: [], waiting: 0 }
})

let prev_nat_y: bigint | null = null
let nat: bigint[] | null = null

console.time('part 1')
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
                s.waiting = 0
            } else {
                s.m.feedInput([-1n])
                s.waiting++
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
                        if (nat === null) {
                            console.timeEnd('part 1')
                            console.log('part 1', Number(s.output[2]))
                            console.time('part 2')
                        }
                        nat = s.output.slice(1)
                        s.output = []
                        s.waiting = 0
                    } else {
                        let recepient = states[Number(s.output[0])]
                        recepient.queue.push(...s.output.slice(1))
                        s.output = []
                        s.waiting = 0
                    }
                }
                break
            }
        }
    }
    if (states.every(s => s.waiting >= 2 && s.queue.length === 0)) {
        assert(nat !== null)
        if (nat[1] === prev_nat_y) {
            console.log('part 2', Number(prev_nat_y))
            console.timeEnd('part 2')
            break
        }
        prev_nat_y = nat[1]
        let recepient = states[0]
        recepient.queue.push(...nat)
    }
}
