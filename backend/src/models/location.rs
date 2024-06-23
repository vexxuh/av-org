use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

use super::room::Room;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Location {
    pub id: Option<String>,
    pub customer_id: String,
    pub user_id: String,
    pub name: String,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LocationWithRooms {
    pub id: Option<String>,
    pub customer_id: Option<String>,
    pub user_id: Option<String>,
    pub name: String,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub rooms: Vec<Room>,
}
