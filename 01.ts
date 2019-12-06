import * as fs from 'fs';
const input = fs.readFileSync('data/01.txt', { encoding: 'utf-8' });
const lines = input.split('\n').filter(Boolean);
let s = 0;
let s2 = 0;
for (const line of lines) {
    let mass = parseInt(line);
    mass = Math.floor(mass / 3) - 2;
    s += mass;
    while (mass > 0) {
        s2 += mass;
        mass = Math.floor(mass / 3) - 2;
    }
}
console.log('part 1:', s);
console.log('part 2:', s2);
