import * as assert from 'assert'

export class Machine {
    mem: bigint[]
    ip: number
    input: bigint[]

    constructor(prog: bigint[]) {
        this.mem = prog.slice(0)
        this.ip = 0
        this.input = []
    }

    feedInput(input: bigint[]) {
        this.input = this.input.concat(input)
    }

    run(): { event: 'INPUT' } | { event: 'OUTPUT', output: bigint } | { event: 'HALT' } {
        let mem = this.mem
        while (true) {
            assert.ok(0 <= this.ip && this.ip < mem.length)
            let modes = mem[this.ip] / 100n
            let opcode = mem[this.ip] % 100n
            if (opcode === 1n) {
                assert.strictEqual(mem[this.ip] / 10000n, 0n)
                mem[Number(mem[this.ip + 3])] = this.readOperand(1) + this.readOperand(2)
                this.ip += 4
            } else if (opcode == 2n) {
                assert.strictEqual(mem[this.ip] / 10000n, 0n)
                mem[Number(mem[this.ip + 3])] = this.readOperand(1) * this.readOperand(2)
                this.ip += 4
            } else if (opcode == 3n) {
                assert.strictEqual(mem[this.ip] / 100n, 0n)
                if (this.input.length == 0) {
                    return { event: 'INPUT' }
                }
                mem[Number(mem[this.ip + 1])] = this.input[0]
                this.input = this.input.slice(1)
                this.ip += 2
            } else if (opcode == 4n) {
                let output = this.readOperand(1)
                this.ip += 2
                return { event: 'OUTPUT', output: output }
            } else if (opcode == 5n) {
                if (this.readOperand(1) !== 0n) {
                    this.ip = Number(this.readOperand(2))
                } else {
                    this.ip += 3
                }
            } else if (opcode == 6n) {
                if (this.readOperand(1) === 0n) {
                    this.ip = Number(this.readOperand(2))
                } else {
                    this.ip += 3
                }
            } else if (opcode == 7n) {
                assert.strictEqual(mem[this.ip] / 10000n, 0n)
                if (this.readOperand(1) <
                    this.readOperand(2)) {
                    mem[Number(mem[this.ip + 3])] = 1n;
                } else {
                    mem[Number(mem[this.ip + 3])] = 0n;
                }
                this.ip += 4
            } else if (opcode == 8n) {
                assert.strictEqual(mem[this.ip] / 10000n, 0n)
                if (this.readOperand(1) ===
                    this.readOperand(2)) {
                    mem[Number(mem[this.ip + 3])] = 1n;
                } else {
                    mem[Number(mem[this.ip + 3])] = 0n;
                }
                this.ip += 4
            } else if (opcode == 99n) {
                return { event: 'HALT' }
            } else {
                assert.fail(`unknown opcode ${opcode}`)
            }
        }
    }

    readOperand(pos: number): bigint {
        let mode;
        if (pos === 1) {
            mode = this.mem[this.ip] / 100n % 10n
        } else if (pos === 2) {
            mode = this.mem[this.ip] / 1000n % 10n
        } else if (pos === 3) {
            mode = this.mem[this.ip] / 10000n % 10n
        } else {
            throw pos
        }
        if (mode === 0n) {
            return this.mem[Number(this.mem[this.ip + pos])]
        } else if (mode === 1n) {
            return this.mem[this.ip + pos]
        } else {
            throw mode
        }
    }
}

export function run(prog: bigint[], inputs: bigint[]): bigint[] {
    let m = new Machine(prog)
    m.feedInput(inputs)
    let result = []
    while (true) {
        let res = m.run()
        if (res.event == 'INPUT') {
            assert.fail('not enough input')
        } else if (res.event == 'OUTPUT') {
            result.push(res.output)
        } else if (res.event = 'HALT') {
            return result
        } else {
            let _: never = res
        }
    }
}
