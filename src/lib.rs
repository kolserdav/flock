/******************************************************************************************
 * Repository: https://github.com/kolserdav/flock.git
 * File name: lib.rs
 * Author: Sergei Kolmiller
 * Email: <kolserdav@conhos.ru>
 * License: MIT
 * License text: See LICENSE file
 * Copyright: kolserdav, All rights reserved (c)
 * Create Date: Sun Dec 22 2024 01:13:14 GMT+0700 (Krasnoyarsk Standard Time)
 ******************************************************************************************/
use napi::bindgen_prelude::Result;
use napi_derive::napi;
use std::fs::File;
mod flock;
use flock::{file_lock, file_open, file_unlock};

#[napi]
pub struct Flock {
    file: File,
}

#[napi]
impl Flock {
    #[napi(constructor)]
    pub fn new(path: String) -> Result<Self> {
        let file = file_open(path.as_str())?;
        Ok(Flock { file })
    }

    #[napi]
    pub async fn lock(&self) -> Result<()> {
        let file = self.file.try_clone()?;
        file_lock(&file).await?;
        Ok(())
    }

    #[napi]
    pub async fn unlock(&self) -> Result<()> {
        let file = self.file.try_clone()?;
        file_unlock(&file).await?;
        Ok(())
    }
}
