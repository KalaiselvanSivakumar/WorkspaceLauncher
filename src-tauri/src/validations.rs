use crate::{
    constants::{FrontendConstants, ValidationConstants},
    errors::{AppError, CmdResult},
    models::WorkspaceConfig,
    utils::normalize_name,
};

fn _validate_workspace_name(name: &str) -> String {
    let normalized_name = normalize_name(name);

    if normalized_name.is_empty() {
        return "Workspace name cannot be empty.".to_string();
    }

    if normalized_name.len() > ValidationConstants::workspace_name_max_length() {
        return format!(
            "Workspace name cannot exceed {} characters.",
            ValidationConstants::workspace_name_max_length()
        );
    }

    if normalized_name.len() < ValidationConstants::workspace_name_min_length() {
        return format!(
            "Workspace name must be at least {} characters long.",
            ValidationConstants::workspace_name_min_length()
        );
    }

    if !normalized_name
        .chars()
        .all(|c| c.is_alphanumeric() || c == '-' || c == '_')
    {
        return "Workspace name can only contain alphanumeric characters, hyphens, and underscores.".to_string();
    }

    return "".to_string();
}

pub fn validate_workspace_name(name: &str) -> CmdResult<()> {
    let error_message = _validate_workspace_name(name);

    if error_message.is_empty() {
        return Ok(());
    }

    return Err(AppError::InvalidConfiguration {
        field: FrontendConstants::workspace_form_field_name(),
        reason: error_message,
        field_label: Some(FrontendConstants::workspace_form_field_label_name()),
    });
}

// Helper: Normalizes and checks if a workspace name collides with another workspace
pub fn validate_workspace_name_uniqueness(
    data: &[WorkspaceConfig],
    name: &str,
    exclude_id: Option<&str>,
) -> CmdResult<()> {
    let normalized = normalize_name(name);

    let exists = data.iter().any(|ws| {
        normalize_name(&ws.name) == normalized && exclude_id.map_or(true, |id| ws.id != id)
    });

    if exists {
        Err(AppError::InvalidConfiguration {
            field: FrontendConstants::workspace_form_field_name(),
            reason: format!("Workspace with name '{}' already exists.", name),
            field_label: Some(FrontendConstants::workspace_form_field_label_name()),
        })
    } else {
        Ok(())
    }
}
