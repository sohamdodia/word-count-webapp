const { workerData, parentPort } = require("worker_threads");
const { wordCount } = require("./utils");

// You can do any heavy stuff here, in a synchronous way
// without blocking the "main thread"
parentPort.postMessage({ data: wordCount(workerData.str) });
