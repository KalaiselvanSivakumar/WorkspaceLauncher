use tauri::{AppHandle, Manager};

use crate::models::AppStateData;

#[tauri::command]
pub async fn get_application_data(app_handle: AppHandle) -> Result<AppStateData, String> {
    // 1. Retrieve the application data directory
    let mut path = match app_handle.path().app_data_dir() {
        Ok(dir) => dir,
        Err(e) => {
            eprintln!("[Error] Failed to get application data directory: {}", e);
            return Err(format!("Failed to get application data directory: {}", e));
        }
    };

    path.push("app_state.json");

    // 2. Check if the file exists
    if !path.exists() {
        println!("[Info] app_state.json does not exist yet. Returning empty object.");
        return Ok(AppStateData::default());
    }

    // 3. Read the file contents
    let file_content = match std::fs::read_to_string(&path) {
        Ok(content) => content,
        Err(e) => {
            eprintln!("[Error] Failed to read file at {:?}: {}", path, e);
            return Err(format!("Failed to read application data file: {}", e));
        }
    };

    // 4. Parse the string into valid JSON
    match serde_json::from_str::<AppStateData>(&file_content) {
        Ok(json) => Ok(json),
        Err(e) => {
            eprintln!(
                "[Error] Failed to parse JSON from file: {}. File might be corrupted.",
                e
            );
            Err(format!("Application data file is corrupted: {}", e))
        }
    }
}