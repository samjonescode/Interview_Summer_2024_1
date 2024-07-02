const Printer = require("../lib/printer");
const MinHeap = require('./MinHeap.js');

/**
 * Given an array of logSources of arbitrary size, each containing an arbitrary number of logs in sorted chronological order,
 * prints all logs in merged chronological order. 
 */
async function sortLogs(logSources, printer, config = { async: false }) {
    const minHeap = new MinHeap();
    // for either async or sync, complete one pass across all log sources to load the heap, leading to max size of N where N is number of sources.
    if (config.async) {
        await Promise.all(logSources.map(async (src) => {
            const entry = await src.popAsync();
            if (entry) {
                minHeap.insert({ entry, src });
            }
        }));
    } else {
        for (const src of logSources) {
            const entry = src.pop();
            if (entry) {
                minHeap.insert({ entry, src });
            }
        }
    }
    // using a stored reference to the source with the current min, remove the current min and pop the next off the same source, inserting it into the MinHeap.
    // this maintains the heap size at ~N by replacing the log entry removed from the heap with the next log entry from the original source of the removed log.
    while (!minHeap.isEmpty()) {
        const { entry, src } = minHeap.extractMin();
        printer.print(entry);
        console.log('MinHeap size to show space consumed: ', minHeap.size());
        if (config.async) {
            const nextEntry = await src.popAsync();
            if (nextEntry) {
                minHeap.insert({ entry: nextEntry, src });
            }
        } else {
            const nextEntry = src.pop();
            if (nextEntry) {
                minHeap.insert({ entry: nextEntry, src });
            }
        }
    }

    printer.done();
}
module.exports = { sortLogs };