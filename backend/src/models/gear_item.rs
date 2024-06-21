use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

use super::{customer::Customer, location::Location, room::Room, tag::Tag};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct GearItem {
    pub id: Option<String>,
    pub room_id: String,
    pub customer_id: String,
    pub location_id: String,
    pub user_id: String,
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
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct GearItemReturn {
    pub id: String,
    pub room_id: String,
    pub customer_id: String,
    pub location_id: String,
    pub user_id: String,
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
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct GearItemReturnWithTags {
    pub gear_item: GearItem,
    pub tags: Vec<Tag>,
}
