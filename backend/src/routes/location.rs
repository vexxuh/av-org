use crate::db::db;
use crate::models::location::Location;
use rocket::serde::json::Json;
use rocket::{delete, get, post, put};
use sqlx::SqlitePool;
use uuid::Uuid;

/**
 * Create Location
 * @param location: Json<Location>
 * @return Json<Location>
 **/
#[post("/", data = "<location>")]
async fn create_location(location: Json<Location>) -> Result<Json<Location>, String> {
    let pool: &SqlitePool = db().await;
    let new_location = location.into_inner();
    let new_id = Uuid::new_v4().to_string();

    let customer_exists: (bool,) = sqlx::query_as(
        r#"
        SELECT EXISTS (
            SELECT 1 FROM customers WHERE id = ?
        )
        "#,
    )
    .bind(&new_location.customer_id)
    .fetch_one(pool)
    .await
    .map_err(|e| format!("Failed to check if customer exists: {}", e))?;

    if !customer_exists.0 {
        return Err("Customer does not exist".to_string());
    }

    let _result = sqlx::query("INSERT INTO locations (id, name, customer_id) VALUES (?, ?, ?)")
        .bind(&new_id)
        .bind(&new_location.name)
        .bind(&new_location.customer_id)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to create location: {}", e))?;

    let sql = format!(
        r#"
        SELECT id, customer_id, name 
        FROM locations 
        WHERE id = '{}'
        "#,
        new_id
    );

    let created_location = sqlx::query_as(&sql)
        .fetch_one(pool)
        .await
        .map_err(|e| format!("Failed to fetch created location: {}", e))?;

    Ok(Json(created_location))
}

/**
 * List Locations
 * @return Json<Vec<Location>>
 **/
#[get("/")]
async fn list_locations() -> Result<Json<Vec<Location>>, String> {
    let pool: &SqlitePool = db().await;

    let locations = sqlx::query_as::<_, Location>(
        r#"
        SELECT id, customer_id, name 
        FROM locations
        "#,
    )
    .fetch_all(pool)
    .await
    .map_err(|e| format!("Failed to fetch locations: {}", e))?;

    Ok(Json(locations))
}

pub fn routes() -> Vec<rocket::Route> {
    routes![create_location, list_locations]
}
