/******************************************************************************************
 * Repository: https://github.com/kolserdav/flock.git
 * File name: flock.rs
 * Author: Sergei Kolmiller
 * Email: <kolserdav@conhos.ru>
 * License: MIT
 * License text: See LICENSE file
 * Copyright: kolserdav, All rights reserved (c)
 * Create Date: Sun Dec 22 2024 01:13:14 GMT+0700 (Krasnoyarsk Standard Time)
 ******************************************************************************************/
use async_std::path::Path;
use fs4::fs_std::FileExt;
use std::{
    fs::{File, OpenOptions},
    io::{ErrorKind, Result},
};

pub async fn file_lock(file: &File) -> Result<()> {
    file.lock_exclusive()?;
    return Ok(());
}

pub async fn file_unlock(file: &File) -> Result<()> {
    file.unlock()?;
    Ok(())
}

pub async fn is_file_locked(file: &File) -> Result<bool> {
    match file.try_lock_exclusive() {
        Ok(_) => {
            file.unlock()?;
            Ok(false)
        }
        Err(e) => {
            if e.kind() == ErrorKind::WouldBlock {
                Ok(true)
            } else {
                Err(e)
            }
        }
    }
}

pub fn file_open(path: &str) -> Result<File> {
    let path = Path::new(path);
    OpenOptions::new().write(true).create(true).open(&path)
}
