use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

use super::location::{Location, LocationWithRooms};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Customer {
    pub id: Option<String>,
    pub name: String,
    pub user_id: String,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct QueryReturnCustomerLocations {
    pub customer_id: Option<String>,
    pub customer_name: Option<String>,
    pub customer_user_id: Option<String>,
    pub customer_created_at: Option<NaiveDateTime>,
    pub customer_updated_at: Option<NaiveDateTime>,
    pub location_id: Option<String>,
    pub location_name: Option<String>,
    pub location_user_id: Option<String>,
    pub room_id: Option<String>,
    pub room_name: Option<String>,
    pub room_user_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CustomerWithLocations {
    pub id: String,
    pub name: String,
    pub user_id: String,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub locations: Vec<LocationWithRooms>,
}
