// @ts-check
const path = require("path");
const Flock = require("../index.cjs");

const filePath = path.resolve("tmp/das");
const flock = Flock(filePath);
console.log(1, flock);
console.log("Lock file 1", filePath);
const fd = flock.flock(filePath);
flock.unlock(fd);
console.log("Lock file 2", filePath);
flock(filePath);
