const path = require("path");
const { Flock } = require("../index.js");

function clearLine() {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
}

(async () => {
  const filePath = path.resolve(process.cwd(), "tmp/example.lock");
  const flock = new Flock(filePath);

  // Show async process
  let i = 0;
  const interval = setInterval(() => {
    clearLine();
    process.stdout.write((i++).toString());
  }, 1000);

  console.log("Try to lock file", filePath);
  flock
    .lock()
    .then(() => {
      clearLine();
      console.log("File locked", filePath);
    })
    .catch((e) => {
      console.error("Lock error", e);
    });

  // Unlock after timeout
  setTimeout(() => {
    clearInterval(interval);
    clearLine();
    console.log("Try to unlock file", filePath);
    flock
      .unlock()
      .then(() => {
        console.log("File unlocked", filePath);
      })
      .catch((e) => {
        console.error("Unlock error", e);
      });
  }, 10000);
})();
