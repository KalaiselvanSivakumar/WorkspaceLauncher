use std::sync::Mutex;

use crate::models::AppStateData;

pub struct AppState {
    pub data: Mutex<Option<AppStateData>>,
}