"use strict";
const { sortLogs } = require('./solution.js')
// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  sortLogs(logSources, printer, false);
  return console.log("Sync sort complete.");
};
