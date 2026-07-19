use serde::{Deserialize, Serialize};
use ts_rs::TS;

// Launcher data models for the application. These models are used to represent the configuration and state of the application, including launchers, tab groups, and links. The `TS` derive macro is used to generate TypeScript definitions for these models, allowing for seamless integration between Rust and TypeScript codebases.

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/types/models.ts")]
pub struct AppConfig {
    pub id: String,
    pub name: String,
    pub launchers: Vec<Launcher>,
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
    pub action: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub profile: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub tab_group: Option<TabGroup>,

    pub links: Vec<Link>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/types/models.ts")]
pub struct VsCodeLauncher {
    pub action: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,
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

#[derive(Debug, Clone, Serialize, Deserialize, TS, Default)]
#[ts(export, export_to = "../../src/types/models.ts")]
pub struct AppStateData {
    pub data: Vec<AppConfig>,
}
