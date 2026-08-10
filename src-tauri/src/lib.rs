pub mod chrome;
pub mod commands;
pub mod constants;
pub mod fs_utils;
pub mod migrations;
pub mod models;
pub mod state;
pub mod utils;
pub mod vscode;

mod init;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            init::setup_app(app.handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_application_data,
            commands::pick_folder,
            commands::fetch_chrome_profiles,
            commands::create_workspace,
            commands::delete_workspace,
            commands::launch_workspace
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
