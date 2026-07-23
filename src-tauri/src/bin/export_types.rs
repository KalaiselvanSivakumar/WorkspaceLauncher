use ts_rs::{Config, TS};
use workspace_launcher_lib::models::{
    AppStateData, ChromeLauncher, Launcher, LauncherAction, Link, TabGroup, VsCodeLauncher,
    WorkspaceConfig,
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
}
