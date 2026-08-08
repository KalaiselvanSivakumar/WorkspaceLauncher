// Centralized filename for JSON files used by the application to save application state.
// This avoids scattering literal filenames across the codebase and makes
// renaming files easier and less error-prone.
pub const APP_STATE_FILENAME: &str = "app_state.json";

pub const APP_VERSION: &str = env!("CARGO_PKG_VERSION");
