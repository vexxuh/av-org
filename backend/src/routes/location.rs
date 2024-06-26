use crate::db::db;
use crate::models::location::Location;
use chrono::Utc;
use rocket::serde::json::Json;
use rocket::{delete, get, post, put, Route};
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
    let now = Utc::now().naive_utc();

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

    let _result = sqlx::query(
        "INSERT INTO locations (id, name, customer_id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(&new_id)
    .bind(&new_location.name)
    .bind(&new_location.customer_id)
    .bind(&new_location.user_id)
    .bind(&now)
    .bind(&now)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to create location: {}", e))?;

    let sql = format!(
        r#"
        SELECT id, customer_id, user_id, name, created_at, updated_at
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
 * Edit Location
 * @param id: String
 * @param location: Json<Location>
 * @return Json<Location>
 */
#[put("/<id>", data = "<location>")]
async fn edit_location(id: String, location: Json<Location>) -> Result<Json<Location>, String> {
    let pool: &SqlitePool = db().await;
    let updated_location = location.into_inner();
    let now = Utc::now().naive_utc();

    let customer_exists: (bool,) = sqlx::query_as(
        r#"
        SELECT EXISTS (
            SELECT 1 FROM customers WHERE id = ?
        )
        "#,
    )
    .bind(&updated_location.customer_id)
    .fetch_one(pool)
    .await
    .map_err(|e| format!("Failed to check if customer exists: {}", e))?;

    if !customer_exists.0 {
        return Err("Customer does not exist".to_string());
    }

    let location_exists: (bool,) = sqlx::query_as(
        r#"
        SELECT EXISTS (
            SELECT 1 FROM locations WHERE id = ?
        )
        "#,
    )
    .bind(&id)
    .fetch_one(pool)
    .await
    .map_err(|e| format!("Failed to check if location exists: {}", e))?;

    if !location_exists.0 {
        return Err(format!("Location with id {} does not exist", id));
    }

    let _result = sqlx::query(
        r#"
        UPDATE locations SET
        name = ?, customer_id = ?, user_id = ?, updated_at = ?
        WHERE id = ?
        "#,
    )
    .bind(&updated_location.name)
    .bind(&updated_location.customer_id)
    .bind(&updated_location.user_id)
    .bind(&now)
    .bind(&id)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to update location: {}", e))?;

    let sql = format!(
        r#"
        SELECT id, customer_id, user_id, name, created_at, updated_at
        FROM locations 
        WHERE id = '{}'
        "#,
        id
    );

    let edited_location = sqlx::query_as(&sql)
        .fetch_one(pool)
        .await
        .map_err(|e| format!("Failed to fetch updated location: {}", e))?;

    Ok(Json(edited_location))
}

/**
 * List Locations
 * @param customer_id: Option<String>
 * @return Json<Vec<Location>>
 **/
#[get("/?<customer_id>")]
async fn list_locations(customer_id: Option<String>) -> Result<Json<Vec<Location>>, String> {
    let pool: &SqlitePool = db().await;

    if let Some(customer_id) = customer_id {
        let customer_exists: (bool,) = {
            sqlx::query_as(
                r#"
                 SELECT EXISTS (
                     SELECT 1 FROM customers WHERE id = ?
                 )
                 "#,
            )
            .bind(&customer_id)
            .fetch_one(pool)
            .await
            .map_err(|e| format!("Failed to check if customer exists: {}", e))?
        };

        if !customer_exists.0 {
            return Err("Customer does not exist".to_string());
        }

        let locations = sqlx::query_as::<_, Location>(
            r#"
             SELECT id, customer_id, name, user_id, created_at, updated_at
             FROM locations
             WHERE customer_id = ?
             "#,
        )
        .bind(&customer_id)
        .fetch_all(pool)
        .await
        .map_err(|e| format!("Failed to fetch locations: {}", e))?;

        return Ok(Json(locations));
    }

    let locations = sqlx::query_as::<_, Location>(
        r#"
         SELECT id, customer_id, user_id, name, created_at, updated_at
         FROM locations
         "#,
    )
    .fetch_all(pool)
    .await
    .map_err(|e| format!("Failed to fetch locations: {}", e))?;

    Ok(Json(locations))
}

/**
 * Delete Location
 * @param id: String
 * @param user_id: String
 * @return Result<Json<String>, String>
 */
#[delete("/<id>?<user_id>")]
async fn delete_location(id: String, user_id: String) -> Result<Json<String>, String> {
    let pool: &SqlitePool = db().await;

    let location: Option<(String,)> = sqlx::query_as(
        r#"
        SELECT user_id
        FROM locations
        WHERE id = ?
        "#,
    )
    .bind(&id)
    .fetch_optional(pool)
    .await
    .map_err(|e| format!("Failed to check if location exists: {}", e))?;

    if let Some((location_user_id,)) = location {
        if location_user_id != user_id {
            return Err(format!("Unauthorized to delete this location").into());
        }
    } else {
        return Err(format!("Location with id {} does not exist", id).into());
    }

    let _update_result = sqlx::query(
        r#"
        UPDATE gear_items
        SET location_id = NULL
        WHERE location_id = ?
        "#,
    )
    .bind(&id)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to update gear items: {}", e))?;

    let _update_rooms_result = sqlx::query(
        r#"
        UPDATE rooms
        SET location_id = NULL
        WHERE location_id = ?
        "#,
    )
    .bind(&id)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to update rooms: {}", e))?;

    let _delete_location_result = sqlx::query("DELETE FROM locations WHERE id = ?")
        .bind(&id)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to delete location: {}", e))?;

    Ok(Json(id))
}

pub fn routes() -> Vec<Route> {
    routes![
        create_location,
        list_locations,
        delete_location,
        edit_location
    ]
}
