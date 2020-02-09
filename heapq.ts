export function heap_push<T>(heap: T[], elem: T, cmp: (a: T, b: T) => number) {
    let idx = heap.length
    heap.push(elem)
    while (idx > 0) {
        let parent = (idx - 1) >> 1
        if (cmp(heap[parent], heap[idx]) <= 0) {
            break
        }
        let t = heap[parent]
        heap[parent] = heap[idx]
        heap[idx] = t
        idx = parent
    }
}

export function heap_pop<T>(heap: T[], cmp: (a: T, b: T) => number): T | undefined {
    if (heap.length === 0) {
        return undefined
    }
    let result = heap[0]
    heap[0] = heap[heap.length - 1]
    let idx = 0
    heap.pop()
    while (true) {
        let left = idx * 2 + 1
        if (left >= heap.length) {
            break
        }
        let right = left + 1
        let next
        if (right < heap.length && cmp(heap[left], heap[right]) > 0) {
            next = right
        } else {
            next = left
        }
        if (cmp(heap[idx], heap[next]) <= 0) {
            break
        }
        let t = heap[idx]
        heap[idx] = heap[next]
        heap[next] = t
        idx = next
    }
    return result
}
