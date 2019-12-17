import * as fs from 'fs'
import * as intcode from './intcode.js'

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
