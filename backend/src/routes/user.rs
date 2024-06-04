use crate::config::db::db;
use crate::models::user::User;
use rocket::serde::json::Json;
use rocket::{delete, get, post, put};
use sqlx::{query_as, SqlitePool};

// async fn create_user(user: Json<User>) -> Json<User> {
//     let pool: &SqlitePool = db().await;
//     let result = query_as!(
//         User,
//         "INSERT INTO users (username, email) VALUES (?, ?) RETURNING *",
//         user.username,
//         user.email
//     )
//     .fetch_one(pool)
//     .await
//     .expect("Failed to create user");
//     Json(result)
// }

// #[get("/<id>")]
// async fn get_user(id: i64) -> Json<User> {
//     let pool: &SqlitePool = db().await;
//     let result = sqlx::query_as!(User, "SELECT * FROM users WHERE id = ?", id)
//         .fetch_one(pool)
//         .await
//         .expect("Failed to fetch user");
//     Json(result)
// }

// #[put("/<id>", data = "<user>")]
// async fn update_user(id: i64, user: Json<User>) -> Json<User> {
//     let pool: &SqlitePool = db().await;
//     let result = sqlx::query_as!(
//         User,
//         "UPDATE users SET username = ?, email = ? WHERE id = ? RETURNING *",
//         user.username,
//         user.email,
//         id
//     )
//     .fetch_one(pool)
//     .await
//     .expect("Failed to update user");
//     Json(result)
// }

// #[delete("/<id>")]
// async fn delete_user(id: i64) -> Json<User> {
//     let pool: &SqlitePool = db().await;
//     let result = sqlx::query_as!(User, "DELETE FROM users WHERE id = ? RETURNING *", id)
//         .fetch_one(pool)
//         .await
//         .expect("Failed to delete user");
//     Json(result)
// }

pub fn routes() -> Vec<rocket::Route> {
    // routes![create_user, get_user, update_user, delete_user]
    routes![]
}
