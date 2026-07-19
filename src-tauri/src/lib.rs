// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use tauri::{AppHandle, Manager};

pub mod models;

#[tauri::command]
async fn get_application_data(app_handle: AppHandle) -> serde_json::Value {
    // 1. Retrieve the application data directory
    let mut path = match app_handle.path().app_data_dir() {
        Ok(dir) => dir,
        Err(e) => {
            eprintln!("[Error] Failed to get application data directory: {}", e);
            return serde_json::json!({});
        }
    };

    path.push("app_state.json");

    // 2. Check if the file exists
    if !path.exists() {
        println!("[Info] app_state.json does not exist yet. Returning empty object.");
        return serde_json::json!({});
    }

    // 3. Read the file contents
    let file_content = match std::fs::read_to_string(&path) {
        Ok(content) => content,
        Err(e) => {
            eprintln!("[Error] Failed to read file at {:?}: {}", path, e);
            return serde_json::json!({});
        }
    };

    // 4. Parse the string into valid JSON
    match serde_json::from_str(&file_content) {
        Ok(json) => json,
        Err(e) => {
            eprintln!(
                "[Error] Failed to parse JSON from file: {}. File might be corrupted.",
                e
            );
            serde_json::json!({})
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_application_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
