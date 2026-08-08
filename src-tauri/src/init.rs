use std::sync::Mutex;

use tauri::{AppHandle, Manager};

use crate::{
    constants::APP_STATE_FILENAME,
    fs_utils::{check_and_initialize_app_state, read_json_file},
    state::AppState,
};

// Type alias so you don't have to write Box<dyn std::error::Error> everywhere
pub type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

pub fn setup_app(app_handle: &AppHandle) -> Result<()> {
    check_and_initialize_app_state(app_handle)?;

    let loaded_state = read_json_file(app_handle, APP_STATE_FILENAME)?;

    app_handle.manage(AppState {
        config: Mutex::new(loaded_state),
    });

    Ok(())
}
