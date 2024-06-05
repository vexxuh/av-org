use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Location {
    pub id: Option<String>,
    pub customer_id: String,
    pub name: String,
}
