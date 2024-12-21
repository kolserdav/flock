/******************************************************************************************
 * Repository: https://github.com/kolserdav/flock.git
 * File name: main.rs
 * Author: Sergey Kolmiller
 * Email: <kolserdav@conhos.ru>
 * License: MIT
 * License text: See LICENSE file
 * Copyright: kolserdav, All rights reserved (c)
 * Create Date: Fri Dec 20 2024 17:17:18 GMT+0700 (Krasnoyarsk Standard Time)
 ******************************************************************************************/
use async_std::task;
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
    task::block_on(file_lock(&file))?;

    println!("File descriptor: {:?}", file);
    writeln!(file, "This file is locked!")?;

    println!("File is locked. Press Enter to unlock...");
    let _ = stdin().read_line(&mut String::new());

    task::block_on(file_unlock(&file))?;
    println!("File is unlocked.");

    Ok(())
}
