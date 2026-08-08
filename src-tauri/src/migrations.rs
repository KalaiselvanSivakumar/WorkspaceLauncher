use tauri::AppHandle;

use crate::{
    constants::{APP_STATE_FILENAME, APP_VERSION},
    fs_utils,
    models::AppStateData,
};

/// Evaluates loaded state and applies sequential migrations if app_version differs from current APP_VERSION.
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
    // Each migration function checks whether it needs to run, updates fields, and bumps `app_version`.

    migrate_unversioned_to_0_1_0(&mut loaded_state)?;
    // migrate_0_1_0_to_0_2_0(&mut state)?;
    // migrate_0_2_0_to_0_3_0(&mut state)?;

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

// =========================================================================
// Individual Version Migration Helpers
// =========================================================================

/// Handles initial unversioned / empty state upgrades to 0.1.0
fn migrate_unversioned_to_0_1_0(state: &mut AppStateData) -> Result<(), String> {
    if state.app_version.is_empty() {
        println!("[Migration] Running migration: Legacy/Empty -> 0.1.0");

        // Apply any field transformations or defaults here
        state.app_version = "0.1.0".to_string();
    }
    Ok(())
}

/// Example future migration step (0.1.0 -> 0.2.0)
#[allow(dead_code)]
fn migrate_0_1_0_to_0_2_0(state: &mut AppStateData) -> Result<(), String> {
    if state.app_version == "0.1.0" {
        println!("[Migration] Running migration: 0.1.0 -> 0.2.0");

        // Example schema transformation:
        // for workspace in &mut state.data {
        //     workspace.is_favorite = false;
        // }

        state.app_version = "0.2.0".to_string();
    }
    Ok(())
}
