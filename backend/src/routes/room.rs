use crate::db::db;
use crate::models::room::Room;
use chrono::Utc;
use rocket::serde::json::Json;
use rocket::{delete, get, post, put, Route};
use sqlx::SqlitePool;
use uuid::Uuid;

/**
 * Create Room
 * @param room: Json<Room>
 * @return Json<Room>
 **/
#[post("/", data = "<room>")]
async fn create_room(room: Json<Room>) -> Result<Json<Room>, String> {
    let pool: &SqlitePool = db().await;
    let new_room = room.into_inner();
    let new_id = Uuid::new_v4().to_string();
    let now = Utc::now().naive_utc();

    let location_exists: (bool,) = sqlx::query_as(
        r#"
        SELECT EXISTS (
            SELECT 1 FROM locations WHERE id = ?
        )
        "#,
    )
    .bind(&new_room.location_id)
    .fetch_one(pool)
    .await
    .map_err(|e| format!("Failed to check if location exists: {}", e))?;

    if !location_exists.0 {
        return Err("Location does not exist".to_string());
    }

    let _result = sqlx::query(
        "INSERT INTO rooms (id, name, location_id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .bind(&new_id)
    .bind(&new_room.name)
    .bind(&new_room.location_id)
    .bind(&new_room.user_id)
    .bind(&now)
    .bind(&now)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to create room: {}", e))?;

    let sql = format!(
        r#"
        SELECT id, location_id, user_id, name, created_at, updated_at
        FROM rooms 
        WHERE id = '{}'
        "#,
        new_id
    );

    let created_room = sqlx::query_as(&sql)
        .fetch_one(pool)
        .await
        .map_err(|e| format!("Failed to fetch created room: {}", e))?;

    Ok(Json(created_room))
}

/**
 * List Rooms
 * @param location_id: Option<String>
 * @return Json<Vec<Room>>
 **/
#[get("/?<location_id>")]
async fn list_rooms(location_id: Option<String>) -> Result<Json<Vec<Room>>, String> {
    let pool: &SqlitePool = db().await;

    if let Some(location_id) = location_id {
        let location_exists: (bool,) = {
            sqlx::query_as(
                r#"
                 SELECT EXISTS (
                     SELECT 1 FROM locations WHERE id = ?
                 )
                 "#,
            )
            .bind(&location_id)
            .fetch_one(pool)
            .await
            .map_err(|e| format!("Failed to check if location exists: {}", e))?
        };

        if !location_exists.0 {
            return Err("Location does not exist".to_string());
        }

        let rooms = sqlx::query_as::<_, Room>(
            r#"
             SELECT id, location_id, name, user_id, created_at, updated_at
             FROM rooms
             WHERE location_id = ?
             "#,
        )
        .bind(&location_id)
        .fetch_all(pool)
        .await
        .map_err(|e| format!("Failed to fetch rooms: {}", e))?;

        return Ok(Json(rooms));
    }

    let rooms = sqlx::query_as::<_, Room>(
        r#"
         SELECT id, location_id, name, user_id, created_at, updated_at
         FROM rooms
         "#,
    )
    .fetch_all(pool)
    .await
    .map_err(|e| format!("Failed to fetch rooms: {}", e))?;

    Ok(Json(rooms))
}

pub fn routes() -> Vec<Route> {
    routes![create_room, list_rooms]
}
