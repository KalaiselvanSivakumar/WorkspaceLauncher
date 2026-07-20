use tauri::{AppHandle, Manager, State};

use crate::{
    models::{AppStateData, Launcher, LauncherConfig},
    state::AppState,
};

fn load_application_data(app_handle: AppHandle) -> Result<AppStateData, String> {
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

#[tauri::command]
pub async fn get_application_data(
    app_handle: AppHandle,
    state: State<'_, AppState>,
) -> Result<AppStateData, String> {
    let data = load_application_data(app_handle)?;

    // Store in Rust memory
    let mut stored_data = state.data.lock().unwrap();
    *stored_data = Some(data.clone());

    // Return to frontend
    Ok(data)
}

// TODO: This function is not yet tested.
#[tauri::command]
pub async fn add_launcher_config_to_app_state(
    launcher_config: LauncherConfig,
    app_handle: AppHandle,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let mut data = state.data.lock().unwrap();

    let app_state = data.as_mut().ok_or("Application data not loaded")?;

    // Check if the launcher already exists in the state
    if app_state
        .data
        .iter()
        .any(|l| l.name == launcher_config.name)
    {
        return Err(format!(
            "Launcher with name '{}' already exists.",
            launcher_config.name
        ));
    }

    app_state.data.push(launcher_config.clone());

    // Save the updated state back to the file
    let path = match app_handle.path().app_data_dir() {
        Ok(mut dir) => {
            dir.push("app_state.json");
            dir
        }
        Err(e) => {
            eprintln!("[Error] Failed to get application data directory: {}", e);
            return Err(format!("Failed to get application data directory: {}", e));
        }
    };

    match std::fs::write(&path, serde_json::to_string_pretty(&app_state).unwrap()) {
        Ok(_) => Ok(()),
        Err(e) => {
            eprintln!("[Error] Failed to write to file at {:?}: {}", path, e);
            Err(format!("Failed to save application data: {}", e))
        }
    }
}

#[tauri::command]
pub async fn launch_workspace(name: String, state: State<'_, AppState>) -> Result<(), String> {
    let data = state.data.lock().unwrap();
    let app_state = data.as_ref().ok_or("Application data not loaded")?;

    // Find the launcher configuration by name
    let launcher_config = app_state
        .data
        .iter()
        .find(|l| l.name == name)
        .ok_or(format!("Launcher with name '{}' not found.", name))?;

    // Iterate through each launcher in the configuration and launch them
    for launcher in &launcher_config.launchers {
        match launcher {
            Launcher::Chrome(chrome_launcher) => {
                // Launch Chrome with the specified action, profile, tab group, and links
                // Implement the logic to launch Chrome here
                println!(
                    "Launching Chrome with action: {}, profile: {:?}, tab group: {:?}, links: {:?}",
                    chrome_launcher.action,
                    chrome_launcher.profile,
                    chrome_launcher.tab_group,
                    chrome_launcher.links
                );
            }
            Launcher::VsCode(vscode_launcher) => {
                // Launch VS Code with the specified action and path
                // Implement the logic to launch VS Code here
                println!(
                    "Launching VS Code with action: {}, path: {:?}",
                    vscode_launcher.action, vscode_launcher.path
                );
            }
        }
    }

    Ok(())
}
