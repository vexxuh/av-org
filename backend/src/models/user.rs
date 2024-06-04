use serde::{Deserialize, Serialize};
use sqlx::types::chrono;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: Option<i64>,
    pub username: String,
    pub email: String,
    pub created_at: String,
}
