import * as intcode from './intcode.js';
import { assert } from './util.js';
const CELL_SIZE = 12;
async function main() {
    let text = await (await fetch('./data/13.txt')).text();
    let prog = text.split(',').map(BigInt);
    prog[0] = 2n;
    let m = new intcode.Machine(prog);
    let score_div = document.getElementById('score');
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let outputs = [];
    let paddle_x = 0;
    let ball_x = 0;
    function runFrame() {
        assert(ctx);
        while (true) {
            let res = m.run();
            if (res.event === 'INPUT') {
                // console.log('input')
                m.feedInput([BigInt(Math.sign(ball_x - paddle_x))]);
                setTimeout(runFrame, 40);
                break;
            }
            else if (res.event === 'OUTPUT') {
                outputs.push(Number(res.output));
                if (outputs.length === 3) {
                    let [x, y, type] = outputs;
                    outputs = [];
                    if (x === -1 && y === 0) {
                        score_div.innerText = 'Score: ' + type;
                        continue;
                    }
                    if (type === 0) {
                        ctx.fillStyle = 'black';
                    }
                    else if (type === 1) {
                        ctx.fillStyle = 'gray';
                    }
                    else if (type === 2) {
                        ctx.fillStyle = 'yellow';
                    }
                    else if (type === 3) {
                        paddle_x = x;
                        ctx.fillStyle = 'green';
                    }
                    else if (type === 4) {
                        ball_x = x;
                        ctx.fillStyle = 'white';
                    }
                    else {
                        assert(false, '' + type);
                    }
                    ctx.fillRect(CELL_SIZE * x, CELL_SIZE * y, CELL_SIZE, CELL_SIZE);
                }
            }
            else if (res.event === 'HALT') {
                break;
            }
            else {
                let _ = res;
                assert(false);
            }
        }
    }
    runFrame();
}
main();
