# flock-rs

File locker based on Rust for Node.js

## Requirements

- Cargo v^1.8 ([Install Rustup](https://www.rust-lang.org/tools/install))

## Installation

```sh
npm i flock-rs
```

## Usage

```javascript
const path = require("path");
const { Flock } = require("flock-rs");

const filePath = path.resolve("/tmp/file.lock");
const flock = new Flock(filePath);

(async () => {
  await flock.lock();
  console.log("File locked", filePath);
  await flock.unlock();
  console.log("File unlocked", filePath);
})();
```
