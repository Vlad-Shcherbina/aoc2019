function isPassword(s: string): boolean {
    let has_double = false
    for (let i = 1; i < s.length; i++) {
        if (s.charAt(i - 1) > s.charAt(i)) {
            return false
        }
        if (s.charAt(i - 1) === s.charAt(i)) {
            has_double = true
        }
    }
    return has_double
}

function isPassword2(s: string): boolean {
    let has_double = false
    let num_same = 1;
    for (let i = 1; i < s.length; i++) {
        if (s.charAt(i - 1) > s.charAt(i)) {
            return false
        }
        if (s.charAt(i - 1) === s.charAt(i)) {
            num_same++
        } else {
            if (num_same === 2) {
                has_double = true;
            }
            num_same = 1;
        }
    }
    return has_double || num_same === 2
}

const begin = 152085
const end = 670283
let cnt = 0;
let cnt2 = 0;
for (let i = begin; i <= end; i++) {
    if (isPassword(i.toString())) {
        cnt++
    }
    if (isPassword2(i.toString())) {
        cnt2++
    }
}
console.log('part 1', cnt)
console.log('part 2', cnt2)
