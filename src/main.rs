use std::io::{stdin, Result, Write};
mod flock;
use flock::{file_lock, file_unlock};

fn main() -> Result<()> {
    println!("Waiting to lock file...");
    let mut file = file_lock("tmp/example.lock")?;

    println!("File: {:?}", file);
    writeln!(file, "This file is locked!")?;

    println!("File is locked. Press Enter to unlock...");
    let _ = stdin().read_line(&mut String::new());

    file_unlock(file)?;
    println!("File is unlocked.");

    Ok(())
}
