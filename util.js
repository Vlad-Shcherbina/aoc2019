export function assert(condition, msg) {
    if (!condition) {
        throw new Error(msg);
    }
}
export function gcd(a, b) {
    assert(a === Math.floor(a));
    assert(b === Math.floor(b));
    assert(a >= 0 && b >= 0);
    while (b > 0) {
        let t = a % b;
        a = b;
        b = t;
    }
    return a;
}
