use tauri::{AppHandle, State, Window};

use crate::{
    chrome::{execute_chrome_launcher, get_chrome_profiles},
    constants::APP_STATE_FILENAME,
    errors::{AppError, CmdResult},
    fs_utils::write_json_file,
    models::{AppStateData, ChromeProfileDto, CreateWorkspacePayload, Launcher, WorkspaceConfig},
    state::AppState,
    validations::{validate_workspace_name, validate_workspace_name_uniqueness},
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

// Helper: Handles locking state, mutating data, saving atomically to disk, and handling lock errors
fn mutate_and_save_app_state<F, T>(
    app_handle: &AppHandle,
    state: &State<'_, AppState>,
    mutate: F,
) -> CmdResult<T>
where
    F: FnOnce(&mut Vec<WorkspaceConfig>) -> CmdResult<T>,
{
    let mut app_state = state.config.lock().map_err(|e| AppError::RuntimeError {
        details: format!("Failed to lock application state: {}", e),
    })?;

    let result = mutate(&mut app_state.data)?;

    write_json_file(app_handle, APP_STATE_FILENAME, &*app_state).map_err(|e| {
        AppError::IoError {
            path: APP_STATE_FILENAME.to_string(),
            details: format!("Failed to save application data: {}", e),
        }
    })?;

    Ok(result)
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
) -> CmdResult<WorkspaceConfig> {
    println!("Received workspace creation payload: {:?}", payload);

    mutate_and_save_app_state(&app_handle, &state, |data| {
        validate_workspace_name(&payload.name)?;
        validate_workspace_name_uniqueness(data, &payload.name, None)?;

        let new_workspace: WorkspaceConfig = payload.into();
        data.push(new_workspace.clone());
        Ok(new_workspace)
    })
}

#[tauri::command]
pub async fn update_workspace(
    payload: WorkspaceConfig,
    app_handle: AppHandle,
    state: State<'_, AppState>,
) -> CmdResult<WorkspaceConfig> {
    println!("Received update workspace payload: {:?}", payload);

    mutate_and_save_app_state(&app_handle, &state, |data| {
        validate_workspace_name(&payload.name)?;
        validate_workspace_name_uniqueness(data, &payload.name, Some(&payload.id))?;

        if let Some(workspace) = data.iter_mut().find(|l| l.id == payload.id) {
            let updated_workspace = payload.clone();
            *workspace = payload;
            Ok(updated_workspace)
        } else {
            return Err(AppError::InvalidConfiguration {
                field: "id".to_string(),
                reason: format!("Workspace with ID '{}' does not exist.", payload.id),
                field_label: None,
            });
        }
    })
}

#[tauri::command]
pub async fn delete_workspace(
    workspace_id: String,
    app_handle: AppHandle,
    state: State<'_, AppState>,
) -> CmdResult<()> {
    println!("Delete workspace with workspace ID: {:?}", workspace_id);

    mutate_and_save_app_state(&app_handle, &state, |data| {
        if let Some(target_position) = data.iter_mut().position(|l| l.id == workspace_id) {
            data.remove(target_position);
            Ok(())
        } else {
            return Err(AppError::InvalidConfiguration {
                field: "id".to_string(),
                reason: format!(
                    "Workspace with ID '{}' does not exist or already deleted",
                    workspace_id
                ),
                field_label: None,
            });
        }
    })
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
