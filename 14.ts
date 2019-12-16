import * as fs from 'fs'

interface Entry {
    type: string
    amount: number
}

function parseEntry(s: string): Entry {
    let [amount, type] = s.split(' ')
    return {type: type, amount: parseInt(amount)}
}

let recipes = new Map<string, { product: Entry, ingredients: Entry[] }>()
fs.readFileSync('data/14.txt', {encoding: 'utf8'})
.trimRight().split('\n')
.forEach((line) => {
    let [left, right] = line.split(' => ')
    let ingredients = left.split(', ').map(parseEntry)
    let product = parseEntry(right)
    recipes.set(product.type, {
        product: product,
        ingredients: ingredients,
    })
})

let topological_order: string[] = []
let visited = new Set<string>()
function rec(type: string) {
    if (visited.has(type)) {
        return
    }
    visited.add(type)
    for (let ingredient of recipes.get(type)!.ingredients) {
        if (ingredient.type !== 'ORE') {
            rec(ingredient.type)
        }
    }
    topological_order.push(type)
}
for (let t of recipes.keys()) {
    rec(t)
}
topological_order.reverse()

function f(x: number): number {
    let required = new Map<string, number>()
    required.set('FUEL', x)
    for (let t of topological_order) {
        let req = required.get(t) || 0
        let recipe = recipes.get(t)!
        let count = Math.ceil(req / recipe.product.amount)
        for (let i of recipe.ingredients) {
            required.set(i.type, (required.get(i.type) || 0) + count * i.amount)
        }
    }
    return required.get('ORE')!
}

console.log('part 1', f(1))

let lo = 0
let hi = 1e9
while (hi - lo > 1) {
    let mid = Math.floor((lo + hi) / 2)
    if (f(mid) <= 1e12) {
        lo = mid
    } else {
        hi = mid
    }
}
console.log('part 2', lo)
