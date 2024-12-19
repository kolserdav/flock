const path = require("path");
const { flock, unlock } = require("../index.cjs");

const filePath = path.resolve("tmp/das");
console.log("Lock file 1", filePath);
const fd = flock(filePath);
unlock(fd);
console.log("Lock file 2", filePath);
flock(filePath);
