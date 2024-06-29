const Printer = require("../lib/printer");

function printHeap(minHeap, printer) {
    while (!minHeap.isEmpty()) {
        let min = minHeap.extractMin();
        printer.print(min);
    }
}

function processNextSync(logSources, minHeap, chunkSize) {
    let allDrained = true;
    for (let i = 0; i < chunkSize; i++) {
        for (const src of logSources) {
            const popped = src.pop();
            if (popped) {
                allDrained = false;
                minHeap.insert(popped);
            }
        }
    }
    return allDrained;
}

async function processNextAsync(logSources, minHeap, chunkSize) {
    let allDrained = true;
    await Promise.all(logSources.map(async (src) => {
        for (let i = 0; i < chunkSize; i++) {
            const popped = await src.popAsync();
            if (popped) {
                allDrained = false;
                minHeap.insert(popped);
            }
        }
    }));
    return allDrained;
}
class MinHeap {
    constructor() {
        this.heap = [];
    }

    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    getRightChildIndex(index) {
        return 2 * index + 2;
    }

    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    heapifyUp() {
        let index = this.heap.length - 1;
        while (this.getParentIndex(index) >= 0 && new Date(this.heap[this.getParentIndex(index)].date) > new Date(this.heap[index].date)) {
            this.swap(this.getParentIndex(index), index);
            index = this.getParentIndex(index);
        }
    }

    heapifyDown() {
        let index = 0;
        while (this.getLeftChildIndex(index) < this.heap.length) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            if (this.getRightChildIndex(index) < this.heap.length && new Date(this.heap[this.getRightChildIndex(index)].date) < new Date(this.heap[smallerChildIndex].date)) {
                smallerChildIndex = this.getRightChildIndex(index);
            }
            if (new Date(this.heap[index].date) <= new Date(this.heap[smallerChildIndex].date)) {
                break;
            }
            this.swap(index, smallerChildIndex);
            index = smallerChildIndex;
        }
    }

    insert(value) {
        this.heap.push(value);
        this.heapifyUp();
    }

    extractMin() {
        if (this.heap.length === 0) {
            return null;
        }
        if (this.heap.length === 1) {
            return this.heap.pop();
        }
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown();
        return min;
    }

    peek() {
        if (this.heap.length === 0) {
            return null;
        }
        return this.heap[0];
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}
/**
 * Given an array of logSources, each sorted chronologically, prints the merged logs from all sources in chronological order.
 * The implementation uses a MinHeap to maintain the minimum across log sources. 
 * The chunkSize can be set in case the number of log entries is too high to be processed in memory.
 * The time complexity is O(N log S) where N is the number of log entries summed across all sources, and S is the number of log sources.
 *  For each of the N log entries, we eventually have to insert the entry into the MinHeap (which takes Log S time), therefore the total time is N * Log S.
 * The space complexity is O(S + C) where S is the number of sources and C is the chunk size. 
 *  We store at most one element from each source (S) in the MinHeap plus the size of the chunk undergoing processing (C).
 * @param {Array} logSources 
 * @param {Printer} printer 
 * @param {boolean} async whether the logs should be processed asynchronously.
 * @param {number} chunkSize the count of logs to process at any one time.
 */
async function sortLogs(logSources, printer, async = false, chunkSize = 1000) {
    let allDrained = false;
    const minHeap = new MinHeap();
    while (!allDrained) {
        if (async) {
            allDrained = await processNextAsync(logSources, minHeap, chunkSize);
        } else {
            allDrained = processNextSync(logSources, minHeap, chunkSize);
        }
    }
    printHeap(minHeap, printer)
    printer.done();
}
module.exports = { sortLogs };