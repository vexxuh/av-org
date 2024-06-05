use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct GearItem {
    pub id: Option<String>,
    pub room_id: String,
    pub customer_id: String,
    pub location: String,
    pub manufacturer: String,
    pub device_model: String,
    pub serial_number: String,
    pub hostname: String,
    pub firmware: String,
    pub password: String,
    pub primary_mac: String,
    pub primary_ip: String,
    pub secondary_mac: String,
    pub secondary_ip: String,
}
