use serde::{de::DeserializeOwned, Serialize};
use std::{fs, io::Write, path::PathBuf};
use tauri::{AppHandle, Manager};

use crate::{constants::APP_STATE_FILENAME, models::AppStateData};

/// Return the application data directory or an error message.
fn app_data_dir(app_handle: &AppHandle) -> Result<PathBuf, String> {
    app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get application data directory: {}", e))
}

/// Checks if a file exists inside the app data directory.
fn file_exists(app_handle: &AppHandle, filename: &str) -> Result<bool, String> {
    let mut dir = app_data_dir(app_handle)?;
    dir.push(filename);
    Ok(dir.exists())
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
        eprintln!(
            "[Warning] File {:?} does not exist. Returning default value for type {}.",
            dir,
            std::any::type_name::<T>()
        );
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
    let dir = app_data_dir(app_handle)?;

    let target_file_path = dir.join(filename);
    let temp_file_path = dir.join(format!("{}.tmp", filename));

    let serialized = serde_json::to_string_pretty(data)
        .map_err(|e| format!("Failed to serialize data to JSON: {}", e))?;

    let mut temp_file = fs::File::create(&temp_file_path).map_err(|e| {
        format!(
            "Failed to create temporary file at {:?}: {}",
            temp_file_path, e
        )
    })?;
    temp_file.write_all(serialized.as_bytes()).map_err(|e| {
        format!(
            "Failed to write data to temp file at {:?}: {}",
            temp_file_path, e
        )
    })?;

    temp_file.sync_all().map_err(|e| {
        format!(
            "Failed to sync data to disk for {:?}: {}",
            temp_file_path, e
        )
    })?;

    fs::rename(&temp_file_path, &target_file_path).map_err(|e| {
        let _ = fs::remove_file(&temp_file_path);

        format!(
            "Failed to atomically rename temp file {:?} to target file {:?}: {}",
            temp_file_path, target_file_path, e
        )
    })?;

    Ok(())
}

/// Ensures the application data directory exists, creating it and any parents if missing.
fn ensure_app_data_dir(app_handle: &AppHandle) -> Result<PathBuf, String> {
    let dir = app_data_dir(app_handle)?;
    if !dir.exists() {
        fs::create_dir_all(&dir)
            .map_err(|e| format!("Failed to create application directory at {:?}: {}", dir, e))?;
    }
    Ok(dir)
}

/// Set the default application state in the app data directory, overwriting any existing state.
fn reset_app_state(app_handle: &AppHandle) -> Result<(), String> {
    let default_state = AppStateData::default();

    write_json_file(app_handle, APP_STATE_FILENAME, &default_state)?;

    Ok(())
}

/// Check if the application state file exists, and if not, create it with default content.
pub fn check_and_initialize_app_state(app_handle: &AppHandle) -> Result<(), String> {
    ensure_app_data_dir(app_handle)?;

    if !file_exists(app_handle, APP_STATE_FILENAME)? {
        // If the file doesn't exist, create it with default content
        reset_app_state(app_handle)?;
    }

    Ok(())
}
