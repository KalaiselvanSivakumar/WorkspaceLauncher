use serde::{de::DeserializeOwned, Serialize};
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

// Centralized filename constants for JSON files used by the application.
// This avoids scattering literal filenames across the codebase and makes
// renaming files easier and less error-prone.
pub const APP_STATE_FILENAME: &str = "app_state.json";

pub const APP_VERSION: &str = env!("CARGO_PKG_VERSION");

/// Return the application data directory or an error message.
fn app_data_dir(app_handle: &AppHandle) -> Result<PathBuf, String> {
    app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get application data directory: {}", e))
}

/// Read a JSON file from the app data dir into T. If the file doesn't exist, return T::default().
pub fn read_json_file<T: DeserializeOwned + Default>(
    app_handle: &AppHandle,
    filename: &str,
) -> Result<T, String> {
    let mut dir = app_data_dir(app_handle)?;
    dir.push(filename);

    if !dir.exists() {
        // File not present yet -> return default
        return Ok(T::default());
    }

    let file_content = std::fs::read_to_string(&dir)
        .map_err(|e| format!("Failed to read file at {:?}: {}", dir, e))?;

    serde_json::from_str::<T>(&file_content)
        .map_err(|e| format!("Failed to parse JSON from file {:?}: {}", dir, e))
}

/// Write the given data as pretty JSON into the named file in the app data dir.
pub fn write_json_file<T: Serialize>(
    app_handle: &AppHandle,
    filename: &str,
    data: &T,
) -> Result<(), String> {
    let mut dir = app_data_dir(app_handle)?;
    dir.push(filename);

    let serialized = serde_json::to_string_pretty(data)
        .map_err(|e| format!("Failed to serialize data to JSON: {}", e))?;

    std::fs::write(&dir, serialized)
        .map(|_| ())
        .map_err(|e| format!("Failed to write to file at {:?}: {}", dir, e))
}
