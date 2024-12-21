/******************************************************************************************
 * Repository: https://github.com/kolserdav/flock.git
 * File name: main.rs
 * Author: Sergei Kolmiller
 * Email: <kolserdav@conhos.ru>
 * License: MIT
 * License text: See LICENSE file
 * Copyright: kolserdav, All rights reserved (c)
 * Create Date: Sun Dec 22 2024 01:13:14 GMT+0700 (Krasnoyarsk Standard Time)
 ******************************************************************************************/
use std::{
    io::{stdin, Result},
    time::Duration,
};
mod flock;
use async_std::task::{self, sleep};
use flock::{file_lock, file_open, file_unlock};

async fn test() -> Result<()> {
    task::spawn(async move {
        sleep(Duration::from_secs(2)).await;
        println!("Some async event");
    });

    let file_name = "tmp/example.lock";
    let file = file_open(&file_name)?;
    println!("Waiting to lock file: {}", file_name);

    file_lock(&file).await?;

    println!("File is locked. Press Enter to unlock...");
    let _ = stdin().read_line(&mut String::new());

    file_unlock(&file).await?;
    println!("File is unlocked.");
    Ok(())
}

#[async_std::main]
async fn main() -> Result<()> {
    test().await?;

    Ok(())
}
