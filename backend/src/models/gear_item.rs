use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct GearItem {
    pub id: Option<i64>,
    pub room_id: i64,
    pub gear_name: String,
    pub mac_address: String,
    pub ip_address: String,
}
