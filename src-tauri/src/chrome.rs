use std::process::Command;
use std::{fs, path::PathBuf};

use crate::cmd_utils::spawn_detached;
use crate::constants::ValidationConstants;
use crate::models::{ChromeLauncher, ChromeProfile, LauncherAction};

pub fn get_chrome_profiles() -> Result<Vec<ChromeProfile>, String> {
    let mut path = PathBuf::new();

    #[cfg(target_os = "windows")]
    {
        if let Some(local_app_data) = std::env::var_os("LOCALAPPDATA") {
            path = PathBuf::from(local_app_data);
            path.push(r"Google\Chrome\User Data\Local State");
        }
    }

    #[cfg(target_os = "macos")]
    {
        // env::var_os("HOME") properly targets /Users/yourusername/
        if let Some(home) = std::env::var_os("HOME") {
            path = PathBuf::from(home);
            path.push("Library/Application Support/Google/Chrome/Local State");
        } else {
            return Err("Could not determine the system HOME directory on macOS.".to_string());
        }
    }

    // Comprehensive error logging if the path physically does not exist
    if !path.exists() {
        return Err(format!(
            "Chrome Local State file could not be located. Target path checked: {:?}",
            path
        ));
    }

    let file_content =
        fs::read_to_string(&path).map_err(|e| format!("Failed to read file: {}", e))?;
    let json: serde_json::Value =
        serde_json::from_str(&file_content).map_err(|e| format!("Invalid JSON: {}", e))?;

    let mut profiles = Vec::new();

    if let Some(info_cache) = json.pointer("/profile/info_cache") {
        if let Some(obj) = info_cache.as_object() {
            for (profile_name, data) in obj {
                let name = data
                    .get("name")
                    .and_then(|v| v.as_str())
                    .unwrap_or("Unnamed Profile")
                    .to_string();

                profiles.push(ChromeProfile {
                    profile_name: profile_name.clone(),
                    name,
                    full_name: data
                        .get("gaia_name")
                        .and_then(|v| v.as_str())
                        .unwrap_or("Unnamed Profile")
                        .to_string(),
                    email: data
                        .get("user_name")
                        .and_then(|v| v.as_str())
                        .unwrap_or("No Email")
                        .to_string(),
                });
            }
        }
    }

    // Fallback if the file exists but info_cache is structured differently or empty
    if profiles.is_empty() {
        return Err(
            "No profiles found inside the Chrome Local State configuration mapping.".to_string(),
        );
    }

    Ok(profiles)
}

#[cfg(target_os = "windows")]
fn get_chrome_path_from_registry() -> Option<String> {
    use winreg::enums::*;
    use winreg::RegKey;

    let hk_machine = RegKey::predef(HKEY_LOCAL_MACHINE);
    let app_paths_key = hk_machine
        .open_subkey(r"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe")
        .ok()?;
    let path: String = app_paths_key.get_value("").ok()?;
    Some(path)
}

pub fn execute_chrome_launcher(chrome_launcher: &ChromeLauncher) -> Result<String, String> {
    println!(
        "Launching Chrome with action: {:?}, profile: {:?}, tab group: {:?}, links: {:?}",
        chrome_launcher.action,
        chrome_launcher.profile,
        chrome_launcher.tab_group,
        chrome_launcher.links
    );
    match chrome_launcher.action {
        LauncherAction::Open => {
            let chrome_profiles = get_chrome_profiles()
                .map_err(|e| format!("Failed to get Chrome profiles: {}", e))?;

            let default_profile_name =
                ValidationConstants::chrome_system_default_profile_front_end_value();

            let target_profile_input = chrome_launcher
                .profile
                .as_deref()
                .unwrap_or(&default_profile_name);
            let new_window_arg = "--new-window".to_string();
            let mut args = vec![new_window_arg];

            if target_profile_input != default_profile_name {
                let matched_profile = chrome_profiles.iter().find(|cp| {
                    cp.full_name == target_profile_input
                        || cp.name == target_profile_input
                        || cp.profile_name == target_profile_input
                });

                match matched_profile {
                    Some(profile) => {
                        args.push(format!("--profile-directory={}", profile.profile_name));
                    }
                    None => {
                        return Err(format!(
                            "The specified profile '{}' does not exist in Chrome.",
                            target_profile_input
                        ));
                    }
                }
            }

            // Convert Vec<Link> into Vec<String> extracting the URL string field
            // Note: Replace `.url` with your actual field name if it's called something else (e.g., .path, .href)
            let urls: Vec<String> = chrome_launcher
                .links
                .iter()
                .map(|link| link.url.clone())
                .collect();

            args.extend(urls);

            #[cfg(target_os = "windows")]
            {
                // Attempt 1: Try executing via native PATH lookup
                let mut cmd = Command::new("chrome.exe");
                cmd.args(&args);

                if spawn_detached(&mut cmd).is_err() {
                    // Attempt 2: If PATH fails, read the absolute installation path from registry
                    if let Some(registry_path) = get_chrome_path_from_registry() {
                        let mut registry_cmd = Command::new(registry_path);
                        registry_cmd.args(&args);

                        spawn_detached(&mut registry_cmd)
                            .map_err(|e| format!("Registry launch failed: {}", e))?;
                    } else {
                        return Err(
                            "Chrome could not be found via PATH or Windows Registry.".to_string()
                        );
                    }
                }
            }

            #[cfg(target_os = "macos")]
            {
                let mut cmd = Command::new("open");
                cmd.args(["-n", "-a", "Google Chrome", "--args"])
                    .args(&args);

                // -a specifies the application name
                spawn_detached(&mut cmd).map_err(|e| e.to_string())?;
            }

            #[cfg(not(any(target_os = "windows", target_os = "macos")))]
            {
                Err("This launcher does not support the current operating system".to_string())
            }
        }
    }
    return Ok("Success".to_string());
}
