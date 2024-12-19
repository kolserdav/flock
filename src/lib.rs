use napi::bindgen_prelude::{Error, Result, Status};
use napi_derive::napi;
use std::{
    fs::{File, OpenOptions},
    io::{Error as ErrorIO, ErrorKind},
    os::fd::{AsRawFd, FromRawFd},
    path::Path,
};
mod flock;
use flock::{file_lock, file_unlock};

#[napi]
pub struct FlockS {
    pub file: File,
}

#[napi]
impl FlockS {
    #[napi(constructor)]
    pub fn new(path: String) -> Self {
        let path = Path::new(path.as_str());
        let file = OpenOptions::new().write(true).create(true).open(&path)?;
        FlockS { file }
    }

    #[napi]
    pub fn flock(&self) -> Result<i32> {
        let file = file_lock(self::f)?;
        return Ok(file.as_raw_fd());
    }

    #[napi]
    pub fn unlock(fd: i32) -> Result<()> {
        let file = unsafe { File::from_raw_fd(fd) };
        file_unlock(file)?;
        Ok(())
    }
}
