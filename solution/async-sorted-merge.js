"use strict";
const { sortLogs } = require('./solution.js')

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = (logSources, printer) => {
  return new Promise(async (resolve, reject) => {
    console.log('Starting async sort...')
    await sortLogs(logSources, printer, true);
    resolve(console.log("Async sort complete."));
  });
};
