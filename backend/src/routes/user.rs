use crate::db::db;
use crate::models::user::User;
use rocket::serde::json::Json;
use rocket::{delete, get, post, put};
use sqlx::SqlitePool;
use uuid::Uuid;

/**
 * Check if a user exists in the database, and if not, create a new user.
 * @param user: User
 * @return Result<Json<User>, String>
*/
#[post("/create-user", data = "<user>")]
async fn check_or_create_user(user: Json<User>) -> Result<Json<User>, String> {
    let pool: &SqlitePool = db().await;
    let new_user = user.into_inner();

    let existing_user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = ?")
        .bind(&new_user.email)
        .fetch_optional(pool)
        .await
        .map_err(|e| format!("Failed to check if user exists: {}", e))?;

    if let Some(user) = existing_user {
        return Ok(Json(user));
    }

    sqlx::query("INSERT INTO users (id, email, first_name, last_name) VALUES (?, ?, ?, ?)")
        .bind(&new_user.id)
        .bind(&new_user.email)
        .bind(&new_user.first_name)
        .bind(&new_user.last_name)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to create user: {}", e))?;

    Ok(Json(new_user))
}

pub fn routes() -> Vec<rocket::Route> {
    routes![check_or_create_user]
}
