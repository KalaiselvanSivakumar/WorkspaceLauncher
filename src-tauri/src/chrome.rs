use std::{fs, path::PathBuf};

use crate::models::ChromeProfile;

pub fn get_chrome_profiles() -> Result<Vec<ChromeProfile>, String> {
    let mut path;

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

    let file_content = fs::read_to_string(&path).map_err(|e| format!("Failed to read file: {}", e))?;
    let json: serde_json::Value = serde_json::from_str(&file_content).map_err(|e| format!("Invalid JSON: {}", e))?;

    let mut profiles = Vec::new();

    if let Some(info_cache) = json.pointer("/profile/info_cache") {
        if let Some(obj) = info_cache.as_object() {
            for (profile_name, data) in obj {
                let name = data.get("name")
                    .and_then(|v| v.as_str())
                    .unwrap_or("Unnamed Profile")
                    .to_string();

                profiles.push(ChromeProfile {
                    profile_name: profile_name.clone(),
                    name,
                    full_name: data.get("gaia_name")
                        .and_then(|v| v.as_str())
                        .unwrap_or("Unnamed Profile")
                        .to_string(),
                    email: data.get("user_name")
                        .and_then(|v| v.as_str())
                        .unwrap_or("No Email")
                        .to_string(),
                });
            }
        }
    }

    // Fallback if the file exists but info_cache is structured differently or empty
    if profiles.is_empty() {
        return Err("No profiles found inside the Chrome Local State configuration mapping.".to_string());
    }

    Ok(profiles)
}