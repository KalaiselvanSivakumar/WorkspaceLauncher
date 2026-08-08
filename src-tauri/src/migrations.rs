use tauri::AppHandle;

use crate::{
    constants::{APP_STATE_FILENAME, APP_VERSION},
    fs_utils,
    models::AppStateData,
};

pub fn migrate_app_state_if_needed(
    app_handle: &AppHandle,
    mut loaded_state: AppStateData,
) -> Result<AppStateData, String> {
    if loaded_state.app_version == APP_VERSION {
        // No migration needed
        return Ok(loaded_state);
    }

    println!(
        "[Migration] Migrating app state from version {} to {}",
        loaded_state.app_version, APP_VERSION
    );

    // --- Sequential Migration Pipeline ---

    // Migration 0.0.0 / Empty -> 0.1.0
    if loaded_state.app_version.is_empty() {
        loaded_state.app_version = "0.1.0".to_string();
    }

    // Example future migrations:
    // if loaded_state.app_version == "0.1.0" {
    //     // Modify loaded_state fields for v0.2.0
    //     loaded_state.app_version = "0.2.0".to_string();
    // }

    // Set to current runtime version after all steps pass
    loaded_state.app_version = APP_VERSION.to_string();

    // Delegate atomic disk write to fs_utils
    fs_utils::write_json_file(app_handle, APP_STATE_FILENAME, &loaded_state)?;

    println!(
        "[Migration] Successfully migrated state to '{}'",
        APP_VERSION
    );

    Ok(loaded_state)
}
