import * as fs from 'fs'

function fft(xs: number[]): number[] {
    let result: number[] = []
    xs.forEach((_, i) => {
        i++;
        let sum = 0
        xs.forEach((x, j) => {
            let pos = (j + 1) % (4 * i)
            if (i <= pos && pos < 2 * i) {
                sum += x
            } else if (3 * i <= pos) {
                sum -= x
            }
        })
        result.push(Math.abs(sum % 10))
    })
    return result
}

let input = fs.readFileSync('data/16.txt', {encoding: 'utf8'}).trimRight()
let data = []
for (let i = 0; i < input.length; i++) {
    data.push(parseInt(input.charAt(i)))
}
for (let step = 0; step < 100; step++) {
    data = fft(data)
}
console.log('part 1', data.slice(0, 8).join(''))
