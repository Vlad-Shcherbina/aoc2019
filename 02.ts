import * as fs from 'fs'
import * as assert from 'assert'

let program = fs.readFileSync('data/02.txt', {encoding: 'utf-8'})
    .split(',')
    .map((x) => parseInt(x));

function run(noun: number, verb: number) {
    let mem = program.slice(0);
    mem[1] = noun;
    mem[2] = verb;
    let ip = 0;
    while (true) {
        let opcode = mem[ip];
        if (opcode === 1) {
            mem[mem[ip + 3]] = mem[mem[ip + 1]] + mem[mem[ip + 2]];
            ip += 4;
        } else if (opcode === 2) {
            mem[mem[ip + 3]] = mem[mem[ip + 1]] * mem[mem[ip + 2]];
            ip += 4;
        } else if (opcode === 99) {
            break;
        } else {
            assert.ok(false, opcode.toString());
        }
    }
    return mem[0];
}

console.log('part 1', run(12, 2));
for (let noun = 0; noun < program.length; noun++) {
    for (let verb = 0; verb < program.length; verb++) {
        if (run(noun, verb) === 19690720) {
            console.log('part 2', 100 * noun + verb);
        }
    }
}
