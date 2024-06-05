use crate::db::db;
use crate::models::room::Room;
use rocket::serde::json::Json;
use rocket::{delete, get, post, put};
use sqlx::SqlitePool;
use uuid::Uuid;

#[post("/", data = "<room>")]
async fn create_room(room: Json<Room>) -> Result<Json<Room>, String> {
    let pool: &SqlitePool = db().await;
    let new_room = room.into_inner();
    let new_id = Uuid::new_v4().to_string();

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

    let _result = sqlx::query("INSERT INTO rooms (id, name, location_id) VALUES (?, ?, ?)")
        .bind(&new_id)
        .bind(&new_room.name)
        .bind(&new_room.location_id)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to create room: {}", e))?;

    let sql = format!(
        r#"
        SELECT id, location_id, name 
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

pub fn routes() -> Vec<rocket::Route> {
    routes![create_room]
}
