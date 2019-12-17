import * as fs from 'fs'
import * as intcode from './intcode.js'
import { assert } from './util.js'

let prog = fs.readFileSync('data/17.txt', {encoding: 'utf8'}).split(',').map(BigInt)

let img = intcode.run(prog, [])
    .map((x) => String.fromCharCode(Number(x)))
    .join('').trimRight().split('\n')

let result = 0
for (let i = 1; i < img.length - 1; i++) {
    for (let j = 1; j < img[i].length - 1; j++) {
        if (img[i][j] === '#' &&
            img[i][j - 1] === '#' &&
            img[i][j + 1] === '#' &&
            img[i - 1][j] === '#' &&
            img[i + 1][j] === '#') {
            result += i * j
        }
    }
}
console.log('part 1', result)

prog[0] = 2n
let m = new intcode.Machine(prog)
let a = 'R,8,L,10,R,8'
let b = 'R,12,R,8,L,8,L,12'
let c = 'L,12,L,10,L,8'
// For some reason it does not print final dust when running with
// "Continuous video feed? n"
for (let ch of `A,B,A,C,A,B,C,C,A,B\n${a}\n${b}\n${c}\ny\n`) {
    m.feedInput([BigInt(ch.charCodeAt(0))])
}
let outputs = ''
while (true) {
    let res = m.run()
    if (res.event === 'HALT') {
        console.log('HALT')
        break
    } else if (res.event === 'OUTPUT') {
        if (res.output > 127n) {
            console.log('dust:', res.output)
        } else if (res.output === 10n) {
            // console.log(outputs)  // disabled because it's too slow
            outputs = ''
        } else {
            outputs += String.fromCharCode(Number(res.output))
        }
    } else if (res.event === 'INPUT') {
        console.log('INPUT')
        break
    } else {
        let _: never = res
        assert(false)
    }
}
