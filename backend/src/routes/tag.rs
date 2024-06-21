use crate::db::db;
use crate::models::tag::Tag;
use rocket::get;
use rocket::serde::json::Json;
use sqlx::SqlitePool;

/**
 * List Tags for a User
 * @param user_id: String
 * @return Json<Vec<Tag>>
 **/
#[get("/?<user_id>")]
async fn list_tags_for_user(user_id: String) -> Result<Json<Vec<Tag>>, String> {
    let pool: &SqlitePool = db().await;

    let tags = sqlx::query_as::<_, Tag>(
        r#"
        SELECT id, name, user_id, created_at, updated_at
        FROM tags
        WHERE user_id = ?
        "#,
    )
    .bind(&user_id)
    .fetch_all(pool)
    .await
    .map_err(|e| format!("Failed to fetch tags: {}", e))?;

    Ok(Json(tags))
}

pub fn routes() -> Vec<rocket::Route> {
    routes![list_tags_for_user]
}
