const { Flock } = require("./flock-rs.node");

console.log(12, new Flock("tmp/das1"));

module.exports = Flock;
