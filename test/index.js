const path = require("path");
const { Flock } = require("../index.cjs");

const filePath = path.resolve("tmp/das");
const flock = new Flock(filePath);
console.log("Lock file 1", filePath);
flock.lock();
console.log("Lock file 2", filePath);
while (true) {}
