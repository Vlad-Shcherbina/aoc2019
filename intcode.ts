import { assert } from './util.js'

export class Machine {
    mem: bigint[]
    ip: bigint
    input: bigint[]
    relBase: bigint

    constructor(prog: bigint[]) {
        this.mem = prog.slice(0)
        this.ip = 0n
        this.relBase = 0n
        this.input = []
    }

    feedInput(input: bigint[]) {
        this.input = this.input.concat(input)
    }

    run():
        { event: 'INPUT', executed: number  } |
        { event: 'OUTPUT', output: bigint, executed: number  } |
        { event: 'HALT', executed: number  }
    run(limit: number):
        { event: 'INPUT', executed: number  } |
        { event: 'OUTPUT', output: bigint, executed: number  } |
        { event: 'HALT', executed: number  } |
        { event: 'LIMIT', executed: number }
    run(limit?: number):
        { event: 'INPUT', executed: number  } |
        { event: 'OUTPUT', output: bigint, executed: number  } |
        { event: 'HALT', executed: number  } |
        { event: 'LIMIT', executed: number }
    {
        let mem = this.mem
        let executed = 0
        while (limit === undefined || executed < limit) {
            assert(0 <= this.ip && this.ip < mem.length)
            let m = this.readMem(this.ip)
            let modes = m / 100n
            let opcode = m % 100n
            if (opcode === 1n) {
                this.writeOperand(3n, this.readOperand(1n) + this.readOperand(2n))
                this.ip += 4n
            } else if (opcode == 2n) {
                this.writeOperand(3n, this.readOperand(1n) * this.readOperand(2n))
                this.ip += 4n
            } else if (opcode == 3n) {
                if (this.input.length == 0) {
                    return { event: 'INPUT', executed }
                }
                this.writeOperand(1n, this.input[0])
                this.input = this.input.slice(1)
                this.ip += 2n
            } else if (opcode == 4n) {
                let output = this.readOperand(1n)
                this.ip += 2n
                return { event: 'OUTPUT', output: output, executed }
            } else if (opcode == 5n) {
                if (this.readOperand(1n) !== 0n) {
                    this.ip = this.readOperand(2n)
                } else {
                    this.ip += 3n
                }
            } else if (opcode == 6n) {
                if (this.readOperand(1n) === 0n) {
                    this.ip = this.readOperand(2n)
                } else {
                    this.ip += 3n
                }
            } else if (opcode == 7n) {
                if (this.readOperand(1n) <
                    this.readOperand(2n)) {
                    this.writeOperand(3n, 1n)
                } else {
                    this.writeOperand(3n, 0n)
                }
                this.ip += 4n
            } else if (opcode == 8n) {
                if (this.readOperand(1n) ===
                    this.readOperand(2n)) {
                    this.writeOperand(3n, 1n)
                } else {
                    this.writeOperand(3n, 0n)
                }
                this.ip += 4n
            } else if (opcode == 9n) {
                this.relBase += this.readOperand(1n);
                this.ip += 2n
            } else if (opcode == 99n) {
                return { event: 'HALT', executed }
            } else {
                assert(false, `unknown opcode ${opcode}`)
            }
            executed += 1
        }
        return { event: 'LIMIT', executed }
    }

    readOperand(pos: bigint): bigint {
        let mode = operandMode(pos, this.readMem(this.ip));
        if (mode === 0n) {
            return this.readMem(this.readMem(this.ip + pos))
        } else if (mode === 1n) {
            return this.readMem(this.ip + pos)
        } else if (mode === 2n) {
            return this.readMem(this.relBase + this.readMem(this.ip + pos))
        } else {
            throw mode
        }
    }

    writeOperand(pos: bigint, value: bigint) {
        let mode = operandMode(pos, this.readMem(this.ip));
        if (mode === 0n) {
            this.writeMem(this.readMem(this.ip + pos), value)
        } else if (mode === 1n) {
            throw 'write to imm'
        } else if (mode === 2n) {
            this.writeMem(this.relBase + this.readMem(this.ip + pos), value)
        } else {
            throw mode
        }
    }

    readMem(addr: bigint): bigint {
        if (addr > BigInt(this.mem.length)) {
            return 0n
        }
        assert(addr >= 0n)
        return this.mem[Number(addr)]
    }

    writeMem(addr: bigint, value: bigint) {
        while (addr > BigInt(this.mem.length)) {
            this.mem.push(0n)
        }
        assert(addr >= 0n)
        this.mem[Number(addr)] = value
    }
}

function operandMode(pos: bigint, value: bigint): bigint {
    if (pos === 1n) {
        return value / 100n % 10n
    } else if (pos === 2n) {
        return value / 1000n % 10n
    } else if (pos === 3n) {
        return value / 10000n % 10n
    } else {
        throw pos
    }
}

export function run(prog: bigint[], inputs: bigint[]): bigint[] {
    let m = new Machine(prog)
    m.feedInput(inputs)
    let result = []
    while (true) {
        let res = m.run()
        if (res.event == 'INPUT') {
            assert(false, 'not enough input')
        } else if (res.event == 'OUTPUT') {
            result.push(res.output)
        } else if (res.event = 'HALT') {
            return result
        } else {
            let _: never = res
        }
    }
}

function test() {
    let quine = [109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99].map(BigInt);
    let result = run(quine, [])
    assert(JSON.stringify(quine.map(Number)) === JSON.stringify(result.map(Number)))

    let prog = [1102,34915192,34915192,7,4,7,99,0].map(BigInt)
    let output = run(prog, [])
    assert(output.length === 1)
    assert(output[0].toString().length === 16)

    prog = [104,1125899906842624,99].map(BigInt)
    result = run(prog, [])
    assert(result.length === 1)
    assert(result[0] === 1125899906842624n)
}

// test()
