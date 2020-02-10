import * as fs from 'fs'
import { assert } from './util.js'

const N = 10007

let lines = fs.readFileSync('data/22.txt', {encoding: 'utf8'}).trimEnd().split('\n')
console.log(lines)

let deck = Array.from(new Array(N).keys())

for (let line of lines) {
    let m = null
    if (line === 'deal into new stack') {
        console.log('deal into new stack')
        deck.reverse()
    } else if (m = /cut (-?\d+)/.exec(line)) {
        let offset = parseInt(m[1])
        console.log('cut', offset)
        if (offset < 0) {
            offset += deck.length
        }
        deck = [...deck.slice(offset), ...deck.slice(0, offset)]
    } else if (m = /deal with increment (\d+)/.exec(line)) {
        let increment = parseInt(m[1])
        console.log('deal with increment', increment)
        let new_deck = new Array(deck.length)
        let pos = 0
        for (let x of deck) {
            new_deck[pos] = x
            pos += increment
            if (pos >= deck.length) {
                pos -= deck.length
            }
        }
        deck = new_deck
    } else {
        assert(false, line)
    }
}

console.log('part 1', deck.indexOf(2019))