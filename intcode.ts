import * as assert from 'assert'

function readOperand(ip: number, pos: number, mem: number[]): number {
    let mode;
    if (pos === 1) {
        mode = Math.floor(mem[ip] / 100) % 10
    } else if (pos === 2) {
        mode = Math.floor(mem[ip] / 1000) % 10
    } else if (pos === 3) {
        mode = Math.floor(mem[ip] / 10000) % 10
    } else {
        throw pos
    }
    if (mode === 0) {
        return mem[mem[ip + pos]]
    } else if (mode === 1) {
        return mem[ip + pos]
    } else {
        throw mode
    }
}

export function run(mem: number[], inputs: number[]): number[] {
    let outputs: number[] = []
    let input_pos = 0
    let ip = 0
    while (true) {
        assert.ok(0 <= ip && ip < mem.length)
        let modes = Math.floor(mem[ip] / 100)
        let opcode = mem[ip] % 100
        if (opcode === 1) {
            assert.strictEqual(Math.floor(mem[ip] / 10000), 0)
            mem[mem[ip + 3]] = readOperand(ip, 1, mem) + readOperand(ip, 2, mem)
            ip += 4
        } else if (opcode == 2) {
            assert.strictEqual(Math.floor(mem[ip] / 10000), 0)
            mem[mem[ip + 3]] = readOperand(ip, 1, mem) * readOperand(ip, 2, mem)
            ip += 4
        } else if (opcode == 3) {
            assert.strictEqual(Math.floor(mem[ip] / 100), 0)
            assert.ok(input_pos < inputs.length)
            // console.log('read 5')
            mem[mem[ip + 1]] = inputs[input_pos++]
            ip += 2
        } else if (opcode == 4) {
            // console.log('write', readOperand(ip, 1, mem))
            outputs.push(readOperand(ip, 1, mem))
            ip += 2
        } else if (opcode == 5) {
            if (readOperand(ip, 1, mem) !== 0) {
                ip = readOperand(ip, 2, mem)
            } else {
                ip += 3
            }
        } else if (opcode == 6) {
            if (readOperand(ip, 1, mem) === 0) {
                ip = readOperand(ip, 2, mem)
            } else {
                ip += 3
            }
        } else if (opcode == 7) {
            assert.strictEqual(Math.floor(mem[ip] / 10000), 0)
            if (readOperand(ip, 1, mem) <
                readOperand(ip, 2, mem)) {
                mem[mem[ip + 3]] = 1;
            } else {
                mem[mem[ip + 3]] = 0;
            }
            ip += 4
        } else if (opcode == 8) {
            assert.strictEqual(Math.floor(mem[ip] / 10000), 0)
            if (readOperand(ip, 1, mem) ===
                readOperand(ip, 2, mem)) {
                mem[mem[ip + 3]] = 1;
            } else {
                mem[mem[ip + 3]] = 0;
            }
            ip += 4
        } else if (opcode == 99) {
            break
        } else {
            assert.fail(`unknown opcode ${opcode}`)
        }
    }

    return outputs
}