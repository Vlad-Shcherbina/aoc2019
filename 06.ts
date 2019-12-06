import * as fs from 'fs'
let lines = fs.readFileSync('data/06.txt', {encoding: 'utf8'})
    .split('\n')
    .filter(Boolean)

let children = new Map<string, string[]>()
let parent = new Map<string, string>()
for (let line of lines) {
    let [a, b] = line.split(')')
    if (!children.has(a)) {
        children.set(a, [])
    }
    children.get(a)!.push(b)
    parent.set(b, a)
}

function rec(depth: number, node: string): number {
    let s = depth
    for (let child of children.get(node) || []) {
        s += rec(depth + 1, child)
    }
    return s
}

console.log('part 1', rec(0, 'COM'))

let path1 = []
let node: string | undefined = 'YOU'
while (node) {
    path1.push(node)
    node = parent.get(node)
}
let path2 = []
node = 'SAN'
while (node) {
    path2.push(node)
    node = parent.get(node)
}
while (path1[path1.length - 1] === path2[path2.length - 1]) {
    path1.pop()
    path2.pop()
}
console.log('part 2', path1.length + path2.length - 2)