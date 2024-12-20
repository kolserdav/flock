use std::{
    fs::OpenOptions,
    io::{stdin, Result, Write},
    path::Path,
};
mod flock;
use flock::{file_lock, file_unlock};

fn main() -> Result<()> {
    println!("Waiting to lock file...");
    let path = Path::new("tmp/example.lock");
    let mut file = OpenOptions::new().write(true).create(true).open(&path)?;
    file_lock(&file)?;

    println!("File descriptor: {:?}", file);
    writeln!(file, "This file is locked!")?;

    println!("File is locked. Press Enter to unlock...");
    let _ = stdin().read_line(&mut String::new());

    file_unlock(&file)?;
    println!("File is unlocked.");

    Ok(())
}
