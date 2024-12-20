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
    pub fn flock(&self) -> Result<()> {
        file_lock(&self.file)?;
        return Ok(());
    }

    #[napi]
    pub fn unlock(&self) -> Result<()> {
        file_unlock(&self.file)?;
        Ok(())
    }
}
