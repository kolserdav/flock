/******************************************************************************************
 * Repository: https://github.com/kolserdav/flock.git
 * File name: lib.rs
 * Author: Sergey Kolmiller
 * Email: <kolserdav@conhos.ru>
 * License: MIT
 * License text: See LICENSE file
 * Copyright: kolserdav, All rights reserved (c)
 * Create Date: Fri Dec 20 2024 17:17:18 GMT+0700 (Krasnoyarsk Standard Time)
 ******************************************************************************************/
use napi::bindgen_prelude::Result;
use napi_derive::napi;
use std::{
    fs::{File, OpenOptions},
    path::Path,
};
mod flock;
use flock::{file_lock, file_unlock};

#[napi]
pub struct Flock {
    file: File,
}

#[napi]
impl Flock {
    #[napi(constructor)]
    pub fn new(path: String) -> Result<Self> {
        let path = Path::new(path.as_str());
        let file = OpenOptions::new().write(true).create(true).open(&path)?;
        Ok(Flock { file })
    }

    #[napi]
    pub fn lock(&self) -> Result<()> {
        file_lock(&self.file)?;
        return Ok(());
    }

    #[napi]
    pub fn unlock(&self) -> Result<()> {
        file_unlock(&self.file)?;
        Ok(())
    }
}
