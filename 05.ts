import * as fs from 'fs'
import * as intcode from './intcode.js'

let prog = fs.readFileSync('data/05.txt', {encoding: 'utf8'})
    .split(',')
    .map((x) => BigInt(x))

console.log('part 1', intcode.run(prog.slice(0), [1n]))
console.log('part 2', intcode.run(prog.slice(0), [5n]))
