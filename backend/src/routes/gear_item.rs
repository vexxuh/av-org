use crate::db::db;
use crate::models::gear_item::GearItem;
use rocket::serde::json::Json;
use rocket::{delete, get, post, put};
use sqlx::SqlitePool;
use uuid::Uuid;

#[post("/", data = "<gear_item>")]
async fn create_gear_item(gear_item: Json<GearItem>) -> Result<Json<GearItem>, String> {
    let pool: &SqlitePool = db().await;
    let new_gear_item = gear_item.into_inner();
    let new_id = Uuid::new_v4().to_string();

    let room_exists: (bool,) = sqlx::query_as(
        r#"
        SELECT EXISTS (
            SELECT 1 FROM rooms WHERE id = ?
        )
        "#,
    )
    .bind(&new_gear_item.room_id)
    .fetch_one(pool)
    .await
    .map_err(|e| format!("Failed to check if room exists: {}", e))?;

    if !room_exists.0 {
        return Err("Room does not exist".to_string());
    }

    let customer_exists: (bool,) = sqlx::query_as(
        r#"
        SELECT EXISTS (
            SELECT 1 FROM customers WHERE id = ?
        )
        "#,
    )
    .bind(&new_gear_item.customer_id)
    .fetch_one(pool)
    .await
    .map_err(|e| format!("Failed to check if customer exists: {}", e))?;

    if !customer_exists.0 {
        return Err("Customer does not exist".to_string());
    }

    let _result = sqlx::query(
        r#"
        INSERT INTO gear_items (id, room_id, customer_id, location, manufacturer, device_model, serial_number, hostname, firmware, password, primary_mac, primary_ip, secondary_mac, secondary_ip) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#
    )
    .bind(&new_id)
    .bind(&new_gear_item.room_id)
    .bind(&new_gear_item.customer_id)
    .bind(&new_gear_item.location)
    .bind(&new_gear_item.manufacturer)
    .bind(&new_gear_item.device_model)
    .bind(&new_gear_item.serial_number)
    .bind(&new_gear_item.hostname)
    .bind(&new_gear_item.firmware)
    .bind(&new_gear_item.password)
    .bind(&new_gear_item.primary_mac)
    .bind(&new_gear_item.primary_ip)
    .bind(&new_gear_item.secondary_mac)
    .bind(&new_gear_item.secondary_ip)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to create gear item: {}", e))?;

    let sql = format!(
        r#"
        SELECT id, room_id, customer_id, location, manufacturer, device_model, serial_number, hostname, firmware, password, primary_mac, primary_ip, secondary_mac, secondary_ip 
        FROM gear_items 
        WHERE id = '{}'
        "#,
        new_id
    );

    let created_gear_item = sqlx::query_as(&sql)
        .fetch_one(pool)
        .await
        .map_err(|e| format!("Failed to fetch created gear item: {}", e))?;

    Ok(Json(created_gear_item))
}

pub fn routes() -> Vec<rocket::Route> {
    routes![create_gear_item]
}
