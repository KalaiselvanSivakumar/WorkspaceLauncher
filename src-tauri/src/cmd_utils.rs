use std::process::{Command, Stdio};

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

/// Helper function to spawn a command completely detached from the parent process.
pub fn spawn_detached(cmd: &mut Command) -> Result<(), String> {
    // 1. Redirect stdio to null so closing pipes in a crash won't send SIGPIPE to the child
    cmd.stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null());

    // 2. Platform-specific detachment flags
    #[cfg(target_os = "windows")]
    {
        // Breakaway from parent job object + new process group + detached process

        use crate::constants::CREATE_NEW_PROCESS_GROUP;
        // cmd.creation_flags(DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP | CREATE_BREAKAWAY_FROM_JOB);
        cmd.creation_flags(CREATE_NEW_PROCESS_GROUP);
    }

    // 3. Spawn and drop the Child handle immediately (don't call .wait())
    cmd.spawn().map_err(|e| e.to_string())?;

    Ok(())
}
