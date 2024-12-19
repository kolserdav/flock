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
