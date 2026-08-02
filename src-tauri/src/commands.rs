use tauri::{AppHandle, Manager, State, Window};

use crate::{
    chrome::{execute_chrome_launcher, get_chrome_profiles},
    models::{AppStateData, ChromeProfileDto, CreateWorkspacePayload, Launcher},
    state::AppState,
    vscode::execute_vscode_launcher,
};

#[tauri::command]
pub async fn pick_folder(window: Window) -> Result<Option<String>, String> {
    let folder = rfd::AsyncFileDialog::new()
        .set_title("Select Project Folder")
        .set_parent(&window)
        .pick_folder()
        .await;

    Ok(folder.map(|f| f.path().display().to_string()))
}

#[tauri::command]
pub async fn fetch_chrome_profiles() -> Result<Vec<ChromeProfileDto>, String> {
    let internal_profiles = get_chrome_profiles()?;
    Ok(internal_profiles
        .iter()
        .map(ChromeProfileDto::from)
        .collect())
}

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

#[tauri::command]
pub async fn create_workspace(
    payload: CreateWorkspacePayload,
    app_handle: AppHandle,
    state: State<'_, AppState>,
) -> Result<(), String> {
    println!("Received workspace creation payload: {:?}", payload);

    let mut data = state.data.lock().unwrap();

    let app_state = data.as_mut().ok_or("Application data not loaded")?;

    // Helper closure to normalize names by removing whitespace and lowercasing
    let normalize_name = |name: &str| -> String {
        name.split_whitespace()
            .collect::<Vec<&str>>()
            .join("")
            .to_lowercase()
    };

    // Check if the workspace already exists in the state
    if app_state
        .data
        .iter()
        .any(|l| normalize_name(&l.name) == normalize_name(&payload.name))
    {
        return Err(format!(
            "Workspace with name '{}' already exists.",
            payload.name
        ));
    }

    // Create WorkspaceConfig from CreateWorkspacePayload
    app_state.data.push(payload.into());

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
pub async fn delete_workspace(
    workspace_id: String,
    app_handle: AppHandle,
    state: State<'_, AppState>,
) -> Result<(), String> {
    println!("Delete workspace with workspace ID: {:?}", workspace_id);

    let mut data = state.data.lock().unwrap();

    let app_state = data.as_mut().ok_or("Application data not loaded")?;

    // Check if the workspace exists in the state
    let target_index = app_state.data.iter().position(|l| l.id == workspace_id);

    match target_index {
        Some(index) => {
            app_state.data.remove(index);
        }
        None => {
            return Err(format!(
                "Workspace with ID '{}' does not exist or already deleted.",
                workspace_id
            ));
        }
    }

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
                if let Err(err) = execute_chrome_launcher(chrome_launcher) {
                    println!("Failed to launch Chrome: {}", err);
                }
            }
            Launcher::VsCode(vscode_launcher) => {
                if let Err(err) = execute_vscode_launcher(vscode_launcher) {
                    println!("Failed to launch VS Code: {}", err);
                }
            }
        }
    }

    Ok(())
}
