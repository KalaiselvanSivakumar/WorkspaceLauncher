use std::sync::Mutex;

use crate::models::AppStateData;

pub struct AppState {
    pub config: Mutex<AppStateData>,
}
