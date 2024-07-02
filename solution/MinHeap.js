class MinHeap {
    constructor() {
        this.heap = [];
    }

    size() {
        return this.heap ? this.heap.length : 0;
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
        while (this.getParentIndex(index) >= 0 && new Date(this.heap[this.getParentIndex(index)].entry.date) > new Date(this.heap[index].entry.date)) {
            this.swap(this.getParentIndex(index), index);
            index = this.getParentIndex(index);
        }
    }

    heapifyDown() {
        let index = 0;
        while (this.getLeftChildIndex(index) < this.heap.length) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            if (this.getRightChildIndex(index) < this.heap.length && new Date(this.heap[this.getRightChildIndex(index)].entry.date) < new Date(this.heap[smallerChildIndex].entry.date)) {
                smallerChildIndex = this.getRightChildIndex(index);
            }
            if (new Date(this.heap[index].entry.date) <= new Date(this.heap[smallerChildIndex].entry.date)) {
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

module.exports = MinHeap;