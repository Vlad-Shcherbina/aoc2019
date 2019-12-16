export function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(msg)
    }
}

export function gcd(a: number, b: number): number {
    assert(a === Math.floor(a))
    assert(b === Math.floor(b))
    assert(a >= 0 && b >= 0)
    while (b > 0) {
        let t = a % b
        a = b
        b = t
    }
    return a
}
