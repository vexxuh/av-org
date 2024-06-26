use crate::db::db;
use crate::models::gear_item::{GearItem, GearItemReturn, GearItemReturnWithTags};
use crate::models::tag::Tag;
use chrono::Utc;
use rocket::serde::json::Json;
use rocket::{delete, get, post, put, Route};
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

#[derive(Debug, Serialize, Deserialize)]
pub struct GearItemWithTags {
    pub gear_item: GearItem,
    pub tags: Vec<Tag>,
}

/**
 * Create Gear Item
 * @param gear_item_with_tags: Json<GearItemWithTags>
 * @return Json<GearItem>
 **/
#[post("/", data = "<gear_item_with_tags>")]
async fn create_gear_item(
    gear_item_with_tags: Json<GearItemWithTags>,
) -> Result<Json<GearItem>, String> {
    let pool: &SqlitePool = db().await;
    let new_gear_item = &gear_item_with_tags.gear_item;
    let tags = &gear_item_with_tags.tags;
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

    if !customer_exists.0 {
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

    for tag_payload in tags {
        let tag_id = match sqlx::query_as::<_, Tag>(
            r#"
            SELECT id, name, user_id, created_at, updated_at
            FROM tags
            WHERE name = ?
            "#,
        )
        .bind(&tag_payload.name)
        .fetch_one(pool)
        .await
        {
            Ok(existing_tag) => existing_tag.id.unwrap(),
            Err(_) => {
                let new_tag_id = Uuid::new_v4().to_string();
                sqlx::query(
                    r#"
                    INSERT INTO tags (id, name, user_id, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?)
                    "#,
                )
                .bind(&new_tag_id)
                .bind(&tag_payload.name)
                .bind(&new_gear_item.user_id)
                .bind(&now)
                .bind(&now)
                .execute(pool)
                .await
                .map_err(|e| format!("Failed to create tag: {}", e))?;
                new_tag_id
            }
        };

        sqlx::query(
            r#"
            INSERT INTO gear_item_tags (gear_item_id, tag_id)
            VALUES (?, ?)
            "#,
        )
        .bind(&new_id)
        .bind(&tag_id)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to associate tag with gear item: {}", e))?;
    }

    let sql = format!(
        r#"
        SELECT id, room_id, customer_id, location_id, manufacturer, device_model, serial_number, hostname, firmware, password, primary_mac, primary_ip, secondary_mac, secondary_ip, user_id, created_at, updated_at
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
 * @param tag: Option<String>
 * @return Json<GearItemResponse>
 **/
#[get("/?<page>&<limit>&<search>&<manufacturer>&<device_model>&<firmware>&<tag>")]
async fn list_gear_items(
    page: Option<u32>,
    limit: Option<u32>,
    search: Option<String>,
    manufacturer: Option<String>,
    device_model: Option<String>,
    firmware: Option<String>,
    tag: Option<String>,
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

    if let Some(ref tag_name) = tag {
        filters.push("t.name = ?");
        params.push(tag_name.clone());
    }

    let filters_sql = if filters.is_empty() {
        "".to_string()
    } else {
        format!("WHERE {}", filters.join(" AND "))
    };

    let total_items_query = format!(
        r#"
           SELECT COUNT(DISTINCT g.id)
           FROM gear_items g
           LEFT JOIN rooms r ON g.room_id = r.id
           LEFT JOIN locations l ON g.location_id = l.id
           LEFT JOIN customers c ON g.customer_id = c.id
           LEFT JOIN gear_item_tags git ON g.id = git.gear_item_id
           LEFT JOIN tags t ON git.tag_id = t.id
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
           LEFT JOIN rooms r ON g.room_id = r.id
           LEFT JOIN locations l ON g.location_id = l.id
           LEFT JOIN customers c ON g.customer_id = c.id
           LEFT JOIN gear_item_tags git ON g.id = git.gear_item_id
           LEFT JOIN tags t ON git.tag_id = t.id
           {}
           GROUP BY g.id
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
 * @param gear_item_with_tags: Json<GearItemWithTags>
 * @return Json<GearItem>
 **/
#[post("/quick_add", data = "<gear_item_with_tags>")]
async fn quick_add_gear_item(
    gear_item_with_tags: Json<GearItemWithTags>,
) -> Result<Json<GearItem>, String> {
    let pool: &SqlitePool = db().await;
    let new_gear_item = &gear_item_with_tags.gear_item;
    let tags = &gear_item_with_tags.tags;
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

    for tag_payload in tags {
        let tag_id = match sqlx::query_as::<_, Tag>(
            r#"
            SELECT id, name, user_id, created_at, updated_at
            FROM tags
            WHERE name = ?
            "#,
        )
        .bind(&tag_payload.name)
        .fetch_one(pool)
        .await
        {
            Ok(existing_tag) => existing_tag.id.unwrap(),
            Err(_) => {
                let new_tag_id = Uuid::new_v4().to_string();
                sqlx::query(
                    r#"
                    INSERT INTO tags (id, name, user_id, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?)
                    "#,
                )
                .bind(&new_tag_id)
                .bind(&tag_payload.name)
                .bind(&new_gear_item.user_id)
                .bind(&now)
                .bind(&now)
                .execute(pool)
                .await
                .map_err(|e| format!("Failed to create tag: {}", e))?;
                new_tag_id
            }
        };

        sqlx::query(
            r#"
            INSERT INTO gear_item_tags (gear_item_id, tag_id)
            VALUES (?, ?)
            "#,
        )
        .bind(&new_id)
        .bind(&tag_id)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to associate tag with gear item: {}", e))?;
    }

    let sql = format!(
        r#"
        SELECT id, room_id, customer_id, location_id, manufacturer, device_model, serial_number, hostname, firmware, password, primary_mac, primary_ip, secondary_mac, secondary_ip, user_id, created_at, updated_at
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
async fn get_gear_item_by_id(id: String) -> Result<Json<GearItemReturnWithTags>, String> {
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

    let tags = sqlx::query_as::<_, Tag>(
        r#"
        SELECT t.id, t.name, t.user_id, t.created_at, t.updated_at
        FROM tags t
        JOIN gear_item_tags git ON t.id = git.tag_id
        WHERE git.gear_item_id = ?
        "#,
    )
    .bind(&id)
    .fetch_all(pool)
    .await
    .map_err(|e| format!("Failed to fetch tags: {}", e))?;

    let gear_item_with_tags = GearItemReturnWithTags {
        tags,
        gear_item: GearItem {
            id: Some(gear_item.id.clone()),
            room_id: gear_item.room_id.clone(),
            customer_id: gear_item.customer_id.clone(),
            location_id: gear_item.location_id.clone(),
            user_id: gear_item.user_id.clone(),
            manufacturer: gear_item.manufacturer.clone(),
            device_model: gear_item.device_model.clone(),
            serial_number: gear_item.serial_number.clone(),
            hostname: gear_item.hostname.clone(),
            firmware: gear_item.firmware.clone(),
            password: gear_item.password.clone(),
            primary_mac: gear_item.primary_mac.clone(),
            primary_ip: gear_item.primary_ip.clone(),
            secondary_mac: gear_item.secondary_mac.clone(),
            secondary_ip: gear_item.secondary_ip.clone(),
            created_at: gear_item.created_at.clone(),
            updated_at: gear_item.updated_at.clone(),
        },
    };

    Ok(Json(gear_item_with_tags))
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
 * @param gear_item_with_tags: Json<GearItemWithTags>
 * @return Json<GearItem>
 */
#[put("/<id>", data = "<gear_item_with_tags>")]
async fn edit_gear_item(
    id: String,
    gear_item_with_tags: Json<GearItemWithTags>,
) -> Result<Json<GearItem>, String> {
    let pool: &SqlitePool = db().await;
    let updated_gear_item = &gear_item_with_tags.gear_item;
    let tags = &gear_item_with_tags.tags;
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

    let _result = sqlx::query("DELETE FROM gear_item_tags WHERE gear_item_id = ?")
        .bind(&id)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to delete old tags: {}", e))?;

    for tag_payload in tags {
        let tag_id = match sqlx::query_as::<_, Tag>(
            r#"
            SELECT id, name, user_id, created_at, updated_at
            FROM tags
            WHERE name = ?
            "#,
        )
        .bind(&tag_payload.name)
        .fetch_one(pool)
        .await
        {
            Ok(existing_tag) => existing_tag.id.unwrap(),
            Err(_) => {
                let new_tag_id = Uuid::new_v4().to_string();
                sqlx::query(
                    r#"
                    INSERT INTO tags (id, name, user_id, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?)
                    "#,
                )
                .bind(&new_tag_id)
                .bind(&tag_payload.name)
                .bind(&updated_gear_item.user_id)
                .bind(&now)
                .bind(&now)
                .execute(pool)
                .await
                .map_err(|e| format!("Failed to create tag: {}", e))?;
                new_tag_id
            }
        };

        sqlx::query(
            r#"
            INSERT INTO gear_item_tags (gear_item_id, tag_id)
            VALUES (?, ?)
            "#,
        )
        .bind(&id)
        .bind(&tag_id)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to associate tag with gear item: {}", e))?;
    }

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

pub fn routes() -> Vec<Route> {
    routes![
        create_gear_item,
        list_gear_items,
        quick_add_gear_item,
        delete_gear_item,
        edit_gear_item,
        get_gear_item_by_id
    ]
}
