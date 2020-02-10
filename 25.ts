import * as readline from 'readline'
import * as fs from 'fs'
import * as intcode from './intcode.js'
import { assert } from './util.js'

let rl = readline.createInterface({ input: process.stdin, output: process.stdout })

// https://stackoverflow.com/a/55161953
const getLine = (function () {
    const getLineGen = (async function* () {
        for await (const line of rl) {
            yield line;
        }
    })();
    return async () => ((await getLineGen.next()).value);
})();

async function main() {
    let prog = fs.readFileSync('data/25.txt', {encoding: 'utf8'}).split(',').map(BigInt)
    let m = new intcode.Machine(prog)

    let lines = [
        'east',
        'take manifold',
        'south',
        'take whirled peas',
        'north',
        'west',
        'south',
        'take space heater',
        'south',
        'take dark matter',
        'north',
        'east',
        'north',
        'west',
        'south',
        'take antenna',
        'north',
        'east',
        'south',
        'east',
        'take bowl of rice',
        'north',
        'take klein bottle',
        'north',
        'take spool of cat6',
        'west',
    ]
    let items = [
        'antenna',
        'space heater',
        'whirled peas',
        'manifold',
        'dark matter',
        'spool of cat6',
        'bowl of rice',
        'klein bottle',
    ]
    for (let item of items) {
        lines.push('drop ' + item)
    }
    lines.push('inv')

    items.forEach((item, i) => {
        lines.push('take ' + item)
        items.slice(0, i).forEach((item2, i2) => {
            lines.push('take ' + item2)
            items.slice(0, i2).forEach((item3, i3) => {
                lines.push('take ' + item3)
                items.slice(0, i3).forEach((item4, i4) => {
                    lines.push('take ' + item4)
                    lines.push('north')
                    lines.push('drop ' + item4)
                })
                lines.push('drop ' + item3)
            })
            lines.push('drop ' + item2)
        })
        lines.push('drop ' + item)
    })

    // TODO: deduplicate (anchor: jbWYTVqwDjaN)
    let outputs = ''
    while (true) {
        let res = m.run()
        if (res.event === 'HALT') {
            console.log('HALT')
            rl.close()
            break
        } else if (res.event === 'OUTPUT') {
            assert(res.output <= 127n)
            if (res.output === 10n) {
                console.log(outputs)
                outputs = ''
            } else {
                outputs += String.fromCharCode(Number(res.output))
            }
        } else if (res.event === 'INPUT') {
            let line: string;
            if (lines.length) {
                line = lines[0]
                console.log(line)
                lines = lines.slice(1)
            } else {
                let t = await getLine()
                assert(t)
                line = t
            }
            line += '\n'
            for (let c of line) {
                m.feedInput([BigInt(c.charCodeAt(0))])
            }
        } else {
            let _: never = res
            assert(false)
        }
    }
}

main()
