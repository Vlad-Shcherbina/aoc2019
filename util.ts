import * as assert from 'assert'

export function gcd(a: number, b: number): number {
    assert.strictEqual(a, Math.floor(a))
    assert.strictEqual(b, Math.floor(b))
    assert.ok(a >= 0 && b >= 0)
    while (b > 0) {
        let t = a % b
        a = b
        b = t
    }
    return a
}
