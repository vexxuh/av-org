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
 * Edit Room
 * @param id: String
 * @param room: Json<Room>
 * @return Json<Room>
 */
#[put("/<id>", data = "<room>")]
async fn edit_room(id: String, room: Json<Room>) -> Result<Json<Room>, String> {
    let pool: &SqlitePool = db().await;
    let updated_room = room.into_inner();
    let now = Utc::now().naive_utc();

    let location_exists: (bool,) = sqlx::query_as(
        r#"
        SELECT EXISTS (
            SELECT 1 FROM locations WHERE id = ?
        )
        "#,
    )
    .bind(&updated_room.location_id)
    .fetch_one(pool)
    .await
    .map_err(|e| format!("Failed to check if location exists: {}", e))?;

    if !location_exists.0 {
        return Err("Location does not exist".to_string());
    }

    let room_exists: (bool,) = sqlx::query_as(
        r#"
        SELECT EXISTS (
            SELECT 1 FROM rooms WHERE id = ?
        )
        "#,
    )
    .bind(&id)
    .fetch_one(pool)
    .await
    .map_err(|e| format!("Failed to check if room exists: {}", e))?;

    if !room_exists.0 {
        return Err(format!("Room with id {} does not exist", id));
    }

    let _result = sqlx::query(
        r#"
        UPDATE rooms SET
        name = ?, location_id = ?, user_id = ?, updated_at = ?
        WHERE id = ?
        "#,
    )
    .bind(&updated_room.name)
    .bind(&updated_room.location_id)
    .bind(&updated_room.user_id)
    .bind(&now)
    .bind(&id)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to update room: {}", e))?;

    let sql = format!(
        r#"
        SELECT id, location_id, user_id, name, created_at, updated_at
        FROM rooms 
        WHERE id = '{}'
        "#,
        id
    );

    let edited_room = sqlx::query_as(&sql)
        .fetch_one(pool)
        .await
        .map_err(|e| format!("Failed to fetch updated room: {}", e))?;

    Ok(Json(edited_room))
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

/**
 * Delete Room
 * @param id: String
 * @param user_id: String
 * @return Result<Json<String>, String>
 */
#[delete("/<id>?<user_id>")]
async fn delete_room(id: String, user_id: String) -> Result<Json<String>, String> {
    let pool: &SqlitePool = db().await;

    let room: Option<(String,)> = sqlx::query_as(
        r#"
        SELECT user_id
        FROM rooms
        WHERE id = ?
        "#,
    )
    .bind(&id)
    .fetch_optional(pool)
    .await
    .map_err(|e| format!("Failed to check if room exists: {}", e))?;

    if let Some((room_user_id,)) = room {
        if room_user_id != user_id {
            return Err(format!("Unauthorized to delete this room").into());
        }
    } else {
        return Err(format!("Room with id {} does not exist", id).into());
    }

    let update_result = sqlx::query(
        r#"
        UPDATE gear_items
        SET room_id = NULL
        WHERE room_id = ?
        "#,
    )
    .bind(&id)
    .execute(pool)
    .await;

    if let Err(e) = update_result {
        return Err(format!("Failed to update gear items: {}", e).into());
    }

    let delete_room_result = sqlx::query("DELETE FROM rooms WHERE id = ?")
        .bind(&id)
        .execute(pool)
        .await;

    match delete_room_result {
        Ok(_) => Ok(Json(id)),
        Err(e) => Err(format!("Failed to delete room: {}", e).into()),
    }
}

pub fn routes() -> Vec<Route> {
    routes![create_room, list_rooms, delete_room, edit_room]
}
