use std::sync::Mutex;

use crate::state::AppState;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
pub mod models;

pub mod state;

pub mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            data: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_application_data,
            commands::launch_workspace
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
