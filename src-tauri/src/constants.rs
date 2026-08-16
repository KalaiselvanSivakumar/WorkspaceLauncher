// Windows Process Creation Flags
#[cfg(target_os = "windows")]
pub const DETACHED_PROCESS: u32 = 0x00000008;

#[cfg(target_os = "windows")]
pub const CREATE_NEW_PROCESS_GROUP: u32 = 0x00020000;

#[cfg(target_os = "windows")]
pub const CREATE_BREAKAWAY_FROM_JOB: u32 = 0x01000000;

#[cfg(target_os = "windows")]
pub const CREATE_NO_WINDOW: u32 = 0x08000000;

// Centralized filename for JSON files used by the application to save application state.
// This avoids scattering literal filenames across the codebase and makes
// renaming files easier and less error-prone.
pub const APP_STATE_FILENAME: &str = "app_state.json";

pub const APP_VERSION: &str = env!("CARGO_PKG_VERSION");

/// Constants related to the frontend of the application, such as field names used in forms and other UI elements. These constants help maintain consistency between the frontend and backend, especially when validating user input or handling form submissions.
pub struct FrontendConstants;

impl FrontendConstants {
    pub fn workspace_form_field_name() -> String {
        "name".to_string()
    }

    pub fn workspace_form_field_label_name() -> String {
        "Workspace Name".to_string()
    }

    pub fn workspace_form_field_id() -> String {
        "id".to_string()
    }
}

/// Validation constants for IPC commands and other parts of the application. These constants define limits and constraints for various fields, ensuring consistent validation across the application.
pub struct ValidationConstants;

impl ValidationConstants {
    pub fn workspace_name_min_length() -> usize {
        5
    }

    pub fn workspace_name_max_length() -> usize {
        50
    }

    pub fn chrome_system_default_profile_front_end_value() -> String {
        "-- System Default --".to_string()
    }
}
