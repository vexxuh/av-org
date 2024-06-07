use serde::{Deserialize, Serialize};

use super::{customer::Customer, location::Location, room::Room};

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

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct GearItemReturn {
    pub id: String,
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
    pub location_name: String,
    pub room_name: String,
    pub customer_name: String,
}
