/// Helper to normalize names by removing whitespace and lowercasing
pub fn normalize_name(name: &str) -> String {
    name.chars()
        .filter(|c| !c.is_whitespace())
        .collect::<String>()
        .to_lowercase()
}
