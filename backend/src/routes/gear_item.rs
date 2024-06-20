use crate::db::db;
use crate::models::gear_item::{GearItem, GearItemReturn};
use chrono::Utc;
use rocket::serde::json::Json;
use rocket::{delete, get, post, put};
use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct GearItemResponse {
    pub gear_items: Vec<GearItemReturn>,
    pub total_items: u32,
    pub total_pages: u32,
    pub current_count: u32,
    pub current_page: u32,
}

/**
 * Create Gear Item
 * @param gear_item: Json<GearItem>
 * @return Json<GearItem>
 **/
#[post("/", data = "<gear_item>")]
async fn create_gear_item(gear_item: Json<GearItem>) -> Result<Json<GearItem>, String> {
    let pool: &SqlitePool = db().await;
    let new_gear_item = gear_item.into_inner();
    let new_id = Uuid::new_v4().to_string();
    let now = Utc::now().naive_utc();

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

    if (!customer_exists.0) {
        return Err("Customer does not exist".to_string());
    }

    let _result = sqlx::query(
        r#"
        INSERT INTO gear_items (id, room_id, customer_id, location_id, user_id, manufacturer, device_model, serial_number, hostname, firmware, password, primary_mac, primary_ip, secondary_mac, secondary_ip, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#
    )
    .bind(&new_id)
    .bind(&new_gear_item.room_id)
    .bind(&new_gear_item.customer_id)
    .bind(&new_gear_item.location_id)
    .bind(&new_gear_item.user_id)
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
    .bind(&now)
    .bind(&now)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to create gear item: {}", e))?;

    let sql = format!(
        r#"
        SELECT id, room_id, customer_id, location_id, user_id, manufacturer, device_model, serial_number, hostname, firmware, password, primary_mac, primary_ip, secondary_mac, secondary_ip, created_at, updated_at 
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

/**
 * List Gear Items
 * @param page: Option<u32>
 * @param limit: Option<u32>
 * @param search: Option<String>
 * @param manufacturer: Option<String>
 * @param device_model: Option<String>
 * @param firmware: Option<String>
 * @return Json<GearItemResponse>
 **/
#[get("/?<page>&<limit>&<search>&<manufacturer>&<device_model>&<firmware>")]
async fn list_gear_items(
    page: Option<u32>,
    limit: Option<u32>,
    search: Option<String>,
    manufacturer: Option<String>,
    device_model: Option<String>,
    firmware: Option<String>,
) -> Result<Json<GearItemResponse>, String> {
    let pool: &SqlitePool = db().await;

    let page = page.unwrap_or(1);
    let per_page = limit.unwrap_or(25);
    let offset = (page - 1) * per_page;

    let mut filters = vec![];
    let mut params = vec![];

    if let Some(ref search_query) = search {
        let search_pattern = format!("%{}%", search_query);
        filters.push("(g.manufacturer LIKE ? OR g.device_model LIKE ? OR g.serial_number LIKE ? OR g.hostname LIKE ? OR g.firmware LIKE ? OR g.primary_mac LIKE ? OR g.primary_ip LIKE ? OR g.secondary_mac LIKE ? OR g.secondary_ip LIKE ? OR r.name LIKE ? OR l.name LIKE ? OR c.name LIKE ?)");
        for _ in 0..12 {
            params.push(search_pattern.clone());
        }
    }

    if let Some(ref manufacturer) = manufacturer {
        filters.push("g.manufacturer = ?");
        params.push(manufacturer.clone());
    }

    if let Some(ref device_model) = device_model {
        filters.push("g.device_model = ?");
        params.push(device_model.clone());
    }

    if let Some(ref firmware) = firmware {
        filters.push("g.firmware = ?");
        params.push(firmware.clone());
    }

    let filters_sql = if filters.is_empty() {
        "".to_string()
    } else {
        format!("WHERE {}", filters.join(" AND "))
    };

    let total_items_query = format!(
        r#"
         SELECT COUNT(*)
         FROM gear_items g
         JOIN rooms r ON g.room_id = r.id
         JOIN locations l ON g.location_id = l.id
         JOIN customers c ON g.customer_id = c.id
         {}
         "#,
        filters_sql
    );

    let mut total_items_stmt = sqlx::query_as::<_, (i64,)>(&total_items_query);
    for param in &params {
        total_items_stmt = total_items_stmt.bind(param);
    }

    let total_items: (i64,) = total_items_stmt
        .fetch_one(pool)
        .await
        .map_err(|e| format!("Failed to fetch total number of gear items: {}", e))?;

    let sql = format!(
        r#"
         SELECT 
             g.id, 
             g.room_id, 
             g.customer_id, 
             g.user_id, 
             g.location_id, 
             g.manufacturer, 
             g.device_model, 
             g.serial_number, 
             g.hostname, 
             g.firmware, 
             g.password, 
             g.primary_mac, 
             g.primary_ip, 
             g.secondary_mac, 
             g.secondary_ip,
             r.name AS room_name,
             l.name AS location_name,
             c.name AS customer_name,
             g.created_at,
             g.updated_at
         FROM gear_items g
         JOIN rooms r ON g.room_id = r.id
         JOIN locations l ON g.location_id = l.id
         JOIN customers c ON g.customer_id = c.id
         {}
         LIMIT ? OFFSET ?
         "#,
        filters_sql
    );

    let mut stmt = sqlx::query_as::<_, GearItemReturn>(&sql);
    for param in &params {
        stmt = stmt.bind(param);
    }
    stmt = stmt.bind(per_page as i64).bind(offset as i64);

    let gear_items = stmt
        .fetch_all(pool)
        .await
        .map_err(|e| format!("Failed to fetch gear items: {}", e))?;

    let total_pages = (total_items.0 as f64 / per_page as f64).ceil() as u32;
    let current_count = gear_items.len() as u32;

    Ok(Json(GearItemResponse {
        gear_items,
        total_items: total_items.0 as u32,
        total_pages,
        current_page: page,
        current_count,
    }))
}

/**
 * Quick Add Gear Item
 * @param gear_item: Json<GearItem>
 * @return Json<GearItem>
 **/
#[post("/quick_add", data = "<gear_item>")]
async fn quick_add_gear_item(gear_item: Json<GearItem>) -> Result<Json<GearItem>, String> {
    let pool: &SqlitePool = db().await;
    let new_gear_item = gear_item.into_inner();
    let new_id = Uuid::new_v4().to_string();
    let now = Utc::now().naive_utc();

    let _result = sqlx::query(
        r#"
        INSERT INTO gear_items (id, room_id, customer_id, location_id, user_id, manufacturer, device_model, serial_number, hostname, firmware, password, primary_mac, primary_ip, secondary_mac, secondary_ip, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#
    )
    .bind(&new_id)
    .bind(&new_gear_item.room_id)
    .bind(&new_gear_item.customer_id)
    .bind(&new_gear_item.location_id)
    .bind(&new_gear_item.user_id)
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
    .bind(&now)
    .bind(&now)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to create gear item: {}", e))?;

    let sql = format!(
        r#"
        SELECT id, room_id, customer_id, location_id, user_id, manufacturer, device_model, serial_number, hostname, firmware, password, primary_mac, primary_ip, secondary_mac, secondary_ip, created_at, updated_at 
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

/**
 * Get Gear Item by ID
 * @param id: String
 * @return Json<GearItemReturn>
 **/
#[get("/<id>")]
async fn get_gear_item_by_id(id: String) -> Result<Json<GearItemReturn>, String> {
    let pool: &SqlitePool = db().await;

    let sql = format!(
        r#"
          SELECT 
              g.id, 
              g.room_id, 
              g.customer_id, 
              g.user_id, 
              g.location_id, 
              g.manufacturer, 
              g.device_model, 
              g.serial_number, 
              g.hostname, 
              g.firmware, 
              g.password, 
              g.primary_mac, 
              g.primary_ip, 
              g.secondary_mac, 
              g.secondary_ip,
              r.name AS room_name,
              l.name AS location_name,
              c.name AS customer_name,
              g.created_at,
              g.updated_at
          FROM gear_items g
          JOIN rooms r ON g.room_id = r.id
          JOIN locations l ON g.location_id = l.id
          JOIN customers c ON g.customer_id = c.id
          WHERE g.id = '{}'
          "#,
        id
    );

    let gear_item = sqlx::query_as::<_, GearItemReturn>(&sql)
        .fetch_one(pool)
        .await
        .map_err(|e| format!("Failed to fetch gear item: {}", e))?;

    Ok(Json(gear_item))
}

/**
 * Delete Gear Item
 * @param id: String
 * @return Json<String>
*/
#[delete("/<id>")]
async fn delete_gear_item(id: String) -> Result<Json<String>, String> {
    let pool: &SqlitePool = db().await;

    let _result = sqlx::query("DELETE FROM gear_items WHERE id = ?")
        .bind(&id)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to delete gear item: {}", e))?;

    Ok(Json(id))
}

/**
 * Edit Gear Item
 * @param id: String
 * @param gear_item: Json<GearItem>
 * @return Json<GearItem>
 */
#[put("/<id>", data = "<gear_item>")]
async fn edit_gear_item(id: String, gear_item: Json<GearItem>) -> Result<Json<GearItem>, String> {
    let pool: &SqlitePool = db().await;
    let updated_gear_item = gear_item.into_inner();
    let now = Utc::now().naive_utc();

    let _result = sqlx::query(
        r#"
        UPDATE gear_items SET
        room_id = ?, customer_id = ?, location_id = ?, user_id = ?, manufacturer = ?, device_model = ?, serial_number = ?, hostname = ?, firmware = ?, password = ?, primary_mac = ?, primary_ip = ?, secondary_mac = ?, secondary_ip = ?, updated_at = ?
        WHERE id = ?
        "#
    )
    .bind(&updated_gear_item.room_id)
    .bind(&updated_gear_item.customer_id)
    .bind(&updated_gear_item.location_id)
    .bind(&updated_gear_item.user_id)
    .bind(&updated_gear_item.manufacturer)
    .bind(&updated_gear_item.device_model)
    .bind(&updated_gear_item.serial_number)
    .bind(&updated_gear_item.hostname)
    .bind(&updated_gear_item.firmware)
    .bind(&updated_gear_item.password)
    .bind(&updated_gear_item.primary_mac)
    .bind(&updated_gear_item.primary_ip)
    .bind(&updated_gear_item.secondary_mac)
    .bind(&updated_gear_item.secondary_ip)
    .bind(&now)
    .bind(&id)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to update gear item: {}", e))?;

    let sql = format!(
        r#"
        SELECT id, room_id, customer_id, location_id, user_id, manufacturer, device_model, serial_number, hostname, firmware, password, primary_mac, primary_ip, secondary_mac, secondary_ip, created_at, updated_at
        FROM gear_items 
        WHERE id = '{}'
        "#,
        id
    );

    let edited_gear_item = sqlx::query_as(&sql)
        .fetch_one(pool)
        .await
        .map_err(|e| format!("Failed to fetch updated gear item: {}", e))?;

    Ok(Json(edited_gear_item))
}

pub fn routes() -> Vec<rocket::Route> {
    routes![
        create_gear_item,
        list_gear_items,
        quick_add_gear_item,
        delete_gear_item,
        edit_gear_item,
        get_gear_item_by_id
    ]
}
