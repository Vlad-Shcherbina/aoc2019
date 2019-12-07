import * as assert from 'assert'

export class Machine {
    mem: number[]
    ip: number
    input: number[]

    constructor(prog: number[]) {
        this.mem = prog.slice(0)
        this.ip = 0
        this.input = []
    }

    feedInput(input: number[]) {
        this.input = this.input.concat(input)
    }

    run(): { event: 'INPUT' } | { event: 'OUTPUT', output: number } | { event: 'HALT' } {
        let mem = this.mem
        while (true) {
            assert.ok(0 <= this.ip && this.ip < mem.length)
            let modes = Math.floor(mem[this.ip] / 100)
            let opcode = mem[this.ip] % 100
            if (opcode === 1) {
                assert.strictEqual(Math.floor(mem[this.ip] / 10000), 0)
                mem[mem[this.ip + 3]] = this.readOperand(1) + this.readOperand(2)
                this.ip += 4
            } else if (opcode == 2) {
                assert.strictEqual(Math.floor(mem[this.ip] / 10000), 0)
                mem[mem[this.ip + 3]] = this.readOperand(1) * this.readOperand(2)
                this.ip += 4
            } else if (opcode == 3) {
                assert.strictEqual(Math.floor(mem[this.ip] / 100), 0)
                if (this.input.length == 0) {
                    return { event: 'INPUT' }
                }
                mem[mem[this.ip + 1]] = this.input[0]
                this.input = this.input.slice(1)
                this.ip += 2
            } else if (opcode == 4) {
                let output = this.readOperand(1)
                this.ip += 2
                return { event: 'OUTPUT', output: output }
            } else if (opcode == 5) {
                if (this.readOperand(1) !== 0) {
                    this.ip = this.readOperand(2)
                } else {
                    this.ip += 3
                }
            } else if (opcode == 6) {
                if (this.readOperand(1) === 0) {
                    this.ip = this.readOperand(2)
                } else {
                    this.ip += 3
                }
            } else if (opcode == 7) {
                assert.strictEqual(Math.floor(mem[this.ip] / 10000), 0)
                if (this.readOperand(1) <
                    this.readOperand(2)) {
                    mem[mem[this.ip + 3]] = 1;
                } else {
                    mem[mem[this.ip + 3]] = 0;
                }
                this.ip += 4
            } else if (opcode == 8) {
                assert.strictEqual(Math.floor(mem[this.ip] / 10000), 0)
                if (this.readOperand(1) ===
                    this.readOperand(2)) {
                    mem[mem[this.ip + 3]] = 1;
                } else {
                    mem[mem[this.ip + 3]] = 0;
                }
                this.ip += 4
            } else if (opcode == 99) {
                return { event: 'HALT' }
            } else {
                assert.fail(`unknown opcode ${opcode}`)
            }
        }
    }

    readOperand(pos: number) {
        let mode;
        if (pos === 1) {
            mode = Math.floor(this.mem[this.ip] / 100) % 10
        } else if (pos === 2) {
            mode = Math.floor(this.mem[this.ip] / 1000) % 10
        } else if (pos === 3) {
            mode = Math.floor(this.mem[this.ip] / 10000) % 10
        } else {
            throw pos
        }
        if (mode === 0) {
            return this.mem[this.mem[this.ip + pos]]
        } else if (mode === 1) {
            return this.mem[this.ip + pos]
        } else {
            throw mode
        }
    }
}

export function run(prog: number[], inputs: number[]): number[] {
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
