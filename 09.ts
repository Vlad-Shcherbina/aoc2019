import * as fs from 'fs'
import * as intcode from './intcode.js'

let prog = fs.readFileSync('data/09.txt', { encoding: 'utf8' })
    .split(',')
    .map((x) => BigInt(x))

console.log('part 1:', intcode.run(prog, [1n]))
