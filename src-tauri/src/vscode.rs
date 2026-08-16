use std::process::Command;

use crate::models::{LauncherAction, VsCodeLauncher};

#[cfg(target_os = "windows")]
use crate::{cmd_utils::spawn_detached, constants::CREATE_NO_WINDOW};

fn build_vscode_args(path: Option<&str>) -> Vec<String> {
    let mut args = Vec::new();

    if let Some(path) = path.filter(|path| !path.trim().is_empty()) {
        args.push(path.to_string());
    }

    args
}

#[cfg(target_os = "windows")]
fn ensure_code_command_available() -> Result<(), String> {
    use std::os::windows::process::CommandExt;

    let output = Command::new("where.exe")
        .arg("code")
        .creation_flags(CREATE_NO_WINDOW)
        .output()
        .map_err(|err| format!("Failed to check for the VS Code command: {}", err))?;

    if output.status.success() {
        Ok(())
    } else {
        Err(
            "VS Code could not be launched because the 'code' command was not found in PATH."
                .to_string(),
        )
    }
}

#[cfg(target_os = "windows")]
fn launch_vscode(args: &[String]) -> Result<String, String> {
    // use std::os::windows::process::CommandExt;

    ensure_code_command_available()?;

    let mut command = Command::new("cmd");
    command.arg("/C").arg("code").args(args);
    // .creation_flags(CREATE_NO_WINDOW); // Prevents CMD window from appearing

    match spawn_detached(&mut command) {
        Ok(_) => Ok("Success".to_string()),
        Err(err) => Err(format!(
            "VS Code could not be launched. The 'code' command failed to start: {}",
            err
        )),
    }
}

#[cfg(not(target_os = "windows"))]
fn launch_vscode(_args: &[String]) -> Result<String, String> {
    Err("VS Code is not supported on this platform.".to_string())
}

pub fn execute_vscode_launcher(vscode_launcher: &VsCodeLauncher) -> Result<String, String> {
    match vscode_launcher.action {
        LauncherAction::Open => {
            let args = build_vscode_args(vscode_launcher.path.as_deref());
            launch_vscode(&args)
        }
    }
}
