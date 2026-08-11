use serde::{ser::SerializeStruct, Deserialize, Serialize};
use thiserror::Error;
use ts_rs::TS;

#[derive(Debug, Error, Deserialize, TS)]
#[ts(tag = "type", export, export_to = "../../src/types/models.ts")]
pub enum AppError {
    /// Represents an error that occurs when the application fails to start.
    #[error("Startup error: {details}")]
    StartupError { details: String },

    /// Represents an error that occurs during runtime.
    #[error("Runtime error: {details}")]
    RuntimeError { details: String },

    /// Represents an error that occurs when a required resource is missing.
    #[error("Resource not found: {details}")]
    ResourceNotFound { details: String },

    /// Represents an error that occurs due to invalid user input.
    #[error("Invalid input: {details}")]
    InvalidInput { details: String },

    /// Represents a generic error with a message.
    #[error("Error: {details}")]
    GenericError { details: String },

    /// Represents an error that occurs when a configuration is invalid.
    #[error("Validation failed for field '{0}': {reason}", self.field_display_name())]
    InvalidConfiguration {
        field: String,
        reason: String,
        field_label: Option<String>,
    },

    /// Represents an error that occurs when a input or output operation fails.
    #[error("I/O error at {path}: {details}")]
    IoError { path: String, details: String },

    /// Represents an error that occurs when the application fails to parse JSON data.
    #[error("Failed to parse JSON: {details}")]
    DeserializationError { details: String },
}

impl AppError {
    pub fn variant_name(&self) -> &'static str {
        match self {
            AppError::StartupError { .. } => "StartupError",
            AppError::RuntimeError { .. } => "RuntimeError",
            AppError::ResourceNotFound { .. } => "ResourceNotFound",
            AppError::InvalidInput { .. } => "InvalidInput",
            AppError::GenericError { .. } => "GenericError",
            AppError::InvalidConfiguration { .. } => "InvalidConfiguration",
            AppError::IoError { .. } => "IoError",
            AppError::DeserializationError { .. } => "DeserializationError",
        }
    }

    pub fn field_display_name(&self) -> &str {
        match self {
            AppError::InvalidConfiguration {
                field,
                reason,
                field_label,
            } => field_label.as_deref().unwrap_or(field.as_str()),
            _ => "",
        }
    }
}

impl Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        // Allocate space for type, formatted message, and up to 2 payload fields
        let mut state = serializer.serialize_struct("AppError", 4)?;

        state.serialize_field("type", self.variant_name())?;

        state.serialize_field("message", &self.to_string())?;

        match self {
            AppError::StartupError { details }
            | AppError::RuntimeError { details }
            | AppError::ResourceNotFound { details }
            | AppError::InvalidInput { details }
            | AppError::GenericError { details }
            | AppError::DeserializationError { details } => {
                state.serialize_field("details", details)?;
            }
            AppError::InvalidConfiguration {
                field,
                reason,
                field_label,
            } => {
                state.serialize_field("field", field)?;
                state.serialize_field("reason", reason)?;
                state.serialize_field("field_label", field_label)?;
            }
            AppError::IoError { path, details } => {
                state.serialize_field("path", path)?;
                state.serialize_field("details", details)?;
            }
        }

        state.end()
    }
}

pub type CmdResult<T> = Result<T, AppError>;
