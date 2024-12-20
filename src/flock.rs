/******************************************************************************************
 * Repository: https://github.com/kolserdav/flock.git
 * File name: flock.rs
 * Author: Sergey Kolmiller
 * Email: <kolserdav@conhos.ru>
 * License: MIT
 * License text: See LICENSE file
 * Copyright: kolserdav, All rights reserved (c)
 * Create Date: Fri Dec 20 2024 17:23:44 GMT+0700 (Krasnoyarsk Standard Time)
 ******************************************************************************************/
use fs4::fs_std::FileExt;
use std::fs::File;
use std::io::Result;

pub fn file_lock(file: &File) -> Result<()> {
    file.lock_exclusive()?;
    return Ok(());
}

pub fn file_unlock(file: &File) -> Result<()> {
    file.unlock()?;
    Ok(())
}
