use ts_rs::{Config, TS};
use workspace_launcher_lib::models::{
    LauncherConfig, AppStateData, ChromeLauncher, Launcher, Link, TabGroup, VsCodeLauncher,
};

fn main() {
    let config = Config::default();

    LauncherConfig::export(&config).unwrap();
    Launcher::export(&config).unwrap();
    ChromeLauncher::export(&config).unwrap();
    VsCodeLauncher::export(&config).unwrap();
    TabGroup::export(&config).unwrap();
    Link::export(&config).unwrap();
    AppStateData::export(&config).unwrap();
}
