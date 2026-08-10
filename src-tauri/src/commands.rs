use tauri::{AppHandle, State, Window};

use crate::{
    chrome::{execute_chrome_launcher, get_chrome_profiles},
    constants::APP_STATE_FILENAME,
    fs_utils::write_json_file,
    models::{AppStateData, ChromeProfileDto, CreateWorkspacePayload, Launcher},
    state::AppState,
    utils::normalize_name,
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

#[tauri::command]
pub async fn get_application_data(state: State<'_, AppState>) -> Result<AppStateData, String> {
    let stored_data = state
        .config
        .lock()
        .map_err(|e| format!("Failed to acquire state lock : {}", e))?;
    Ok(stored_data.clone())
}

#[tauri::command]
pub async fn create_workspace(
    payload: CreateWorkspacePayload,
    app_handle: AppHandle,
    state: State<'_, AppState>,
) -> Result<(), String> {
    println!("Received workspace creation payload: {:?}", payload);

    let mut app_state = state
        .config
        .lock()
        .map_err(|e| format!("Failed to lock application state: {}", e))?;

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
    if let Err(e) = write_json_file(&app_handle, APP_STATE_FILENAME, &*app_state) {
        eprintln!("[Error] {}", e);
        return Err(format!("Failed to save application data: {}", e));
    }

    Ok(())
}

#[tauri::command]
pub async fn delete_workspace(
    workspace_id: String,
    app_handle: AppHandle,
    state: State<'_, AppState>,
) -> Result<(), String> {
    println!("Delete workspace with workspace ID: {:?}", workspace_id);

    let mut app_state = state
        .config
        .lock()
        .map_err(|e| format!("Failed to lock application state: {}", e))?;

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
    if let Err(e) = write_json_file(&app_handle, APP_STATE_FILENAME, &*app_state) {
        eprintln!("[Error] {}", e);
        return Err(format!("Failed to save application data: {}", e));
    }

    Ok(())
}

#[tauri::command]
pub async fn launch_workspace(name: String, state: State<'_, AppState>) -> Result<(), String> {
    let app_state = state
        .config
        .lock()
        .map_err(|e| format!("Failed to lock application state: {}", e))?;

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
