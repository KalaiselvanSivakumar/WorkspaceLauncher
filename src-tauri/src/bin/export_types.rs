use ts_rs::{Config, TS};
use workspace_launcher_lib::{
    errors::AppError,
    models::{
        AppStateData, ChromeLauncher, ChromeProfileDto, CreateWorkspacePayload, Launcher,
        LauncherAction, Link, TabGroup, VsCodeLauncher, WorkspaceConfig,
    },
};

fn main() {
    let config = Config::default();

    WorkspaceConfig::export(&config).unwrap();
    Launcher::export(&config).unwrap();
    LauncherAction::export(&config).unwrap();
    ChromeLauncher::export(&config).unwrap();
    VsCodeLauncher::export(&config).unwrap();
    TabGroup::export(&config).unwrap();
    Link::export(&config).unwrap();
    AppStateData::export(&config).unwrap();
    CreateWorkspacePayload::export(&config).unwrap();

    // Chrome Profiles
    ChromeProfileDto::export(&config).unwrap();

    // Errors
    AppError::export(&config).unwrap();
}
