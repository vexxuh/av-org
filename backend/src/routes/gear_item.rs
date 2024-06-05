use crate::db::db;
use crate::models::gear_item::GearItem;
use rocket::serde::json::Json;
use rocket::{delete, get, post, put};
use sqlx::SqlitePool;

#[post("/", data = "<gear_item>")]
async fn create_gear_item(gear_item: Json<GearItem>) -> Json<GearItem> {
    let pool: &SqlitePool = db().await;
    let result = sqlx::query_as!(
        GearItem,
        "INSERT INTO gear_items (room_id, gear_name, mac_address, ip_address) VALUES (?, ?, ?, ?)",
        gear_item.room_id,
        gear_item.gear_name,
        gear_item.mac_address,
        gear_item.ip_address
    )
    .fetch_one(pool)
    .await
    .expect("Failed to create gear item");
    Json(result)
}

#[get("/<id>")]
async fn get_gear_item(id: i64) -> Json<GearItem> {
    let pool: &SqlitePool = db().await;
    let result = sqlx::query_as!(GearItem, "SELECT * FROM gear_items WHERE id = ?", id)
        .fetch_one(pool)
        .await
        .expect("Failed to fetch gear item");
    Json(result)
}

#[put("/<id>", data = "<gear_item>")]
async fn update_gear_item(id: i64, gear_item: Json<GearItem>) -> Json<GearItem> {
    let pool: &SqlitePool = db().await;
    let result = sqlx::query_as!(
        GearItem,
        "UPDATE gear_items SET room_id = ?, gear_name = ?, mac_address = ?, ip_address = ? WHERE id = ? RETURNING *",
        gear_item.room_id,
        gear_item.gear_name,
        gear_item.mac_address,
        gear_item.ip_address,
        id
    )
    .fetch_one(pool)
    .await
    .expect("Failed to update gear item");
    Json(result)
}

#[delete("/<id>")]
async fn delete_gear_item(id: i64) -> Json<GearItem> {
    let pool: &SqlitePool = db().await;
    let result = sqlx::query_as!(
        GearItem,
        "DELETE FROM gear_items WHERE id = ? RETURNING *",
        id
    )
    .fetch_one(pool)
    .await
    .expect("Failed to delete gear item");
    Json(result)
}

pub fn routes() -> Vec<rocket::Route> {
    routes![
        create_gear_item,
        get_gear_item,
        update_gear_item,
        delete_gear_item
    ]
}
