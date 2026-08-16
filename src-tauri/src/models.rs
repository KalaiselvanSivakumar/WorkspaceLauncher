use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::constants::APP_VERSION;

// Launcher data models for the application. These models are used to represent the configuration and state of the application, including launchers, tab groups, and links. The `TS` derive macro is used to generate TypeScript definitions for these models, allowing for seamless integration between Rust and TypeScript codebases.

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/types/models.ts")]
pub struct WorkspaceConfig {
    pub id: String,
    pub name: String,
    pub launchers: Vec<Launcher>,

    #[serde(default = "Utc::now")]
    pub created_at: DateTime<Utc>,

    #[serde(default = "Utc::now")]
    pub updated_at: DateTime<Utc>,
    // CAUTION: Any new properties added need to this struct need to be manually copied for update_workspace tauri command.
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[serde(tag = "appName")]
#[ts(export, export_to = "../../src/types/models.ts")]
pub enum Launcher {
    #[serde(rename = "chrome")]
    Chrome(ChromeLauncher),

    #[serde(rename = "vs-code")]
    VsCode(VsCodeLauncher),
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/types/models.ts")]
pub struct ChromeLauncher {
    pub action: LauncherAction,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub profile: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub tab_group: Option<TabGroup>,

    pub links: Vec<Link>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/types/models.ts")]
pub struct VsCodeLauncher {
    pub action: LauncherAction,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/types/models.ts")]
pub enum LauncherAction {
    #[serde(rename = "open")]
    Open,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/types/models.ts")]
pub struct TabGroup {
    pub name: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub color: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/types/models.ts")]
pub struct Link {
    pub url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/types/models.ts")]
pub struct AppStateData {
    pub app_version: String,
    pub data: Vec<WorkspaceConfig>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/types/models.ts")]
pub struct CreateWorkspacePayload {
    pub name: String,
    pub launchers: Vec<Launcher>,
}

pub struct ChromeProfile {
    pub profile_name: String,
    pub name: String,
    pub full_name: String,
    pub email: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/types/models.ts")]
pub struct ChromeProfileDto {
    pub profile_name: String,
    pub full_name: String,
}

// Implementations
impl Default for AppStateData {
    fn default() -> Self {
        Self {
            app_version: APP_VERSION.to_string(),
            data: Vec::new(),
        }
    }
}

impl WorkspaceConfig {
    pub fn touch(&mut self) {
        self.updated_at = Utc::now();
    }
}

// Implementations - `From` Traits for Conversions
impl From<CreateWorkspacePayload> for WorkspaceConfig {
    fn from(payload: CreateWorkspacePayload) -> Self {
        let now = Utc::now();

        Self {
            id: uuid::Uuid::new_v4().to_string(),
            name: payload.name,
            launchers: payload.launchers,
            created_at: now,
            updated_at: now,
        }
    }
}

impl From<&ChromeProfile> for ChromeProfileDto {
    fn from(profile: &ChromeProfile) -> Self {
        Self {
            profile_name: profile.profile_name.clone(),
            full_name: profile.full_name.clone(),
        }
    }
}
