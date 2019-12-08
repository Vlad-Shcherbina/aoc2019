import * as fs from 'fs'

function numOccs(s: string, c: string): number {
    return s.split(c).length - 1
}

let data = fs.readFileSync('data/08.txt', {encoding: 'utf8'}).trimRight()
const width = 25
const height = 6
let num_layers = Math.floor(data.length / width / height)
let layers = []
for (let i = 0; i < num_layers; i++) {
    layers.push(data.slice(i * width * height, (i + 1) * width * height))
}

let layer = ''
let num_zeroes = 1e10
layers.forEach((l, i) => {
    let k = numOccs(l, '0')
    if (k < num_zeroes) {
        num_zeroes = k
        layer = l
    }
})
console.log('part 1', numOccs(layer, '1') * numOccs(layer, '2'))

let image: string[] = []
for (let i = 0; i < width * height; i++) {
    image.push('2')
}
for (let layer of layers) {
    for (let i = 0; i < width * height; i++) {
        if (image[i] == '2') {
            image[i] = layer.charAt(i)
        }
    }
}
image = image.map((c) => c === '0' ? ' ' : c)
console.log('part 2')
for (let i = 0; i < height; i++) {
    console.log(image.slice(i * width, (i + 1) * width).join(' '))
}
