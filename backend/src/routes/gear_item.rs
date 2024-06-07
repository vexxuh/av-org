use crate::db::db;
use crate::models::gear_item::{GearItem, GearItemReturn};
use rocket::serde::json::Json;
use rocket::{delete, get, post, put};
use sqlx::SqlitePool;
use uuid::Uuid;

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

/**
 * List Gear Items
 * @param skip: Option<u32>
 * @param limit: Option<u32>
 * @return Json<Vec<GearItem>>
 **/
#[get("/?<skip>&<limit>")]
async fn list_gear_items(
    skip: Option<u32>,
    limit: Option<u32>,
) -> Result<Json<Vec<GearItemReturn>>, String> {
    let pool: &SqlitePool = db().await;

    let skip = skip.unwrap_or(0);
    let limit = limit.unwrap_or(25);

    let sql = format!(
        r#"
        SELECT 
            g.id, 
            g.room_id, 
            g.customer_id, 
            g.location, 
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
            c.name AS customer_name
        FROM gear_items g
        JOIN rooms r ON g.room_id = r.id
        JOIN locations l ON g.location = l.id
        JOIN customers c ON g.customer_id = c.id
        LIMIT {} OFFSET {}
        "#,
        limit, skip
    );

    let gear_items = sqlx::query_as::<_, GearItemReturn>(&sql)
        .fetch_all(pool)
        .await
        .map_err(|e| format!("Failed to fetch gear items: {}", e))?;

    Ok(Json(gear_items))
}

/**
 * Get Gear Item by ID
 * @param id: String
 * @return Json<GearItem>
 **/
#[get("/<id>")]
async fn get_gear_item_by_id(id: String) -> Result<Json<GearItem>, String> {
    let pool: &SqlitePool = db().await;

    let sql = format!(
        r#"
        SELECT id, room_id, customer_id, location, manufacturer, device_model, serial_number, hostname, firmware, password, primary_mac, primary_ip, secondary_mac, secondary_ip 
        FROM gear_items 
        WHERE id = '{}'
        "#,
        id
    );

    let gear_item = sqlx::query_as::<_, GearItem>(&sql)
        .fetch_one(pool)
        .await
        .map_err(|e| format!("Failed to fetch gear item: {}", e))?;

    Ok(Json(gear_item))
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

    let _result = sqlx::query(
        r#"
        UPDATE gear_items SET
        room_id = ?, customer_id = ?, location = ?, manufacturer = ?, device_model = ?, serial_number = ?, hostname = ?, firmware = ?, password = ?, primary_mac = ?, primary_ip = ?, secondary_mac = ?, secondary_ip = ?
        WHERE id = ?
        "#
    )
    .bind(&updated_gear_item.room_id)
    .bind(&updated_gear_item.customer_id)
    .bind(&updated_gear_item.location)
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
    .bind(&id)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to update gear item: {}", e))?;

    let sql = format!(
        r#"
        SELECT id, room_id, customer_id, location, manufacturer, device_model, serial_number, hostname, firmware, password, primary_mac, primary_ip, secondary_mac, secondary_ip 
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
