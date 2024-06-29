use std::collections::HashMap;

use crate::db::db;
use crate::models::customer::{Customer, CustomerWithLocations, QueryReturnCustomerLocations};
use crate::models::location::{Location, LocationWithRooms};
use crate::models::room::Room;
use chrono::Utc;
use rocket::serde::json::Json;
use rocket::{delete, get, post, put};
use sqlx::SqlitePool;
use uuid::Uuid;

/**
 * Create Customer
 * @param customer: Json<Customer>
 * @return Json<Customer>
 **/
#[post("/", data = "<customer>")]
async fn create_customer(customer: Json<Customer>) -> Result<Json<Customer>, String> {
    let pool: &SqlitePool = db().await;
    let new_customer = customer.into_inner();
    let new_id = Uuid::new_v4().to_string();
    let now = Utc::now().naive_utc();

    let _result = sqlx::query(
        "INSERT INTO customers (id, name, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(&new_id)
    .bind(&new_customer.name)
    .bind(&new_customer.user_id)
    .bind(&now)
    .bind(&now)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to create customer: {}", e))?;

    let sql = format!(
        r#"
        SELECT id, name, user_id, created_at, updated_at
        FROM customers 
        WHERE id = '{}'
        "#,
        new_id
    );

    let created_customer = sqlx::query_as(&sql)
        .fetch_one(pool)
        .await
        .map_err(|e| format!("Failed to fetch created customer: {}", e))?;

    Ok(Json(created_customer))
}

/**
 * Edit Customer
 * @param id: String
 * @param customer: Json<Customer>
 * @return Json<Customer>
 */
#[put("/<id>", data = "<customer>")]
async fn edit_customer(id: String, customer: Json<Customer>) -> Result<Json<Customer>, String> {
    let pool: &SqlitePool = db().await;
    let updated_customer = customer.into_inner();
    let now = Utc::now().naive_utc();

    let customer_exists: (bool,) = sqlx::query_as(
        r#"
        SELECT EXISTS (
            SELECT 1 FROM customers WHERE id = ?
        )
        "#,
    )
    .bind(&id)
    .fetch_one(pool)
    .await
    .map_err(|e| format!("Failed to check if customer exists: {}", e))?;

    if !customer_exists.0 {
        return Err(format!("Customer with id {} does not exist", id));
    }

    let _result = sqlx::query(
        r#"
        UPDATE customers SET
        name = ?, user_id = ?, updated_at = ?
        WHERE id = ?
        "#,
    )
    .bind(&updated_customer.name)
    .bind(&updated_customer.user_id)
    .bind(&now)
    .bind(&id)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to update customer: {}", e))?;

    let sql = format!(
        r#"
        SELECT id, name, user_id, created_at, updated_at
        FROM customers 
        WHERE id = '{}'
        "#,
        id
    );

    let edited_customer = sqlx::query_as(&sql)
        .fetch_one(pool)
        .await
        .map_err(|e| format!("Failed to fetch updated customer: {}", e))?;

    Ok(Json(edited_customer))
}

/**
 * List Customers
 * @return Json<Vec<Customer>>
 **/
#[get("/")]
async fn list_customers() -> Result<Json<Vec<Customer>>, String> {
    let pool: &SqlitePool = db().await;

    let customers = sqlx::query_as::<_, Customer>(
        r#"
        SELECT id, name, user_id, created_at, updated_at
        FROM customers
        "#,
    )
    .fetch_all(pool)
    .await
    .map_err(|e| format!("Failed to fetch customers: {}", e))?;

    Ok(Json(customers))
}

/**
 * List all Customers with their locations
 * @param user_id: String
 * @return Json<Vec<CustomerWithLocations>>
 **/
#[get("/<user_id>/locations?<search>")]
async fn list_customer_locations(
    user_id: String,
    search: Option<String>,
) -> Result<Json<Vec<CustomerWithLocations>>, String> {
    let pool: &SqlitePool = db().await;

    let search_pattern = format!("%{}%", search.clone().unwrap_or_default());

    let query = r#"
        SELECT 
            c.id AS customer_id, c.name AS customer_name, c.user_id AS customer_user_id, 
            c.created_at AS customer_created_at, c.updated_at AS customer_updated_at,
            l.id AS location_id, l.name AS location_name, l.user_id AS location_user_id,
            r.id AS room_id, r.name AS room_name, r.user_id AS room_user_id
        FROM customers c
        LEFT JOIN locations l ON c.id = l.customer_id
        LEFT JOIN rooms r ON l.id = r.location_id
        WHERE c.user_id = ?
          AND (c.name LIKE ? OR l.name LIKE ? OR r.name LIKE ?)
    "#;

    let rows = sqlx::query_as::<_, QueryReturnCustomerLocations>(&query)
        .bind(&user_id)
        .bind(&search_pattern)
        .bind(&search_pattern)
        .bind(&search_pattern)
        .fetch_all(pool)
        .await
        .map_err(|e| format!("Failed to fetch customers, locations, and rooms: {}", e))?;

    println!("{:?}", rows);

    let mut customer_map: HashMap<String, CustomerWithLocations> = HashMap::new();
    let mut location_map: HashMap<String, LocationWithRooms> = HashMap::new();

    for row in rows {
        let room = if let (Some(room_id), Some(room_name)) =
            (row.room_id.clone(), row.room_name.clone())
        {
            Some(Room {
                id: Some(room_id.clone()),
                location_id: row.location_id.clone().unwrap_or_default(),
                user_id: row.room_user_id.clone().unwrap_or_default(),
                name: room_name,
                created_at: None,
                updated_at: None,
            })
        } else {
            None
        };

        if let Some(location_id) = row.location_id.clone() {
            let location =
                location_map
                    .entry(location_id.clone())
                    .or_insert_with(|| LocationWithRooms {
                        id: Some(location_id.clone()),
                        customer_id: Some(row.customer_id.clone().unwrap_or_default()),
                        user_id: Some(row.location_user_id.clone().unwrap_or_default()),
                        name: row.location_name.clone().unwrap_or_default(),
                        created_at: None,
                        updated_at: None,
                        rooms: vec![],
                    });

            if let Some(r) = room {
                println!("Adding room {:?} to location {:?}", r, location.id);
                location.rooms.push(r);
            }
        }

        let customer_id = row.customer_id.clone().unwrap_or_default();

        customer_map
            .entry(customer_id.clone())
            .or_insert_with(|| CustomerWithLocations {
                id: customer_id.clone(),
                name: row.customer_name.clone().unwrap_or_default(),
                created_at: row.customer_created_at,
                updated_at: row.customer_updated_at,
                locations: vec![],
                user_id: user_id.clone(),
            });
    }

    for (_, location) in location_map {
        if let Some(customer) =
            customer_map.get_mut(&location.customer_id.clone().unwrap_or_default())
        {
            customer.locations.push(location);
        }
    }

    let customers_with_locations: Vec<CustomerWithLocations> = customer_map.into_values().collect();

    Ok(Json(customers_with_locations))
}

/**
 * Delete Customer
 * @param id: String
 * @param user_id: String
 * @return Result<Json<String>, String>
 */
#[delete("/<id>?<user_id>")]
async fn delete_customer(id: String, user_id: String) -> Result<Json<String>, String> {
    let pool: &SqlitePool = db().await;

    let customer: Option<(String,)> = sqlx::query_as(
        r#"
        SELECT user_id
        FROM customers
        WHERE id = ?
        "#,
    )
    .bind(&id)
    .fetch_optional(pool)
    .await
    .map_err(|e| format!("Failed to check if customer exists: {}", e))?;

    if let Some((customer_user_id,)) = customer {
        if customer_user_id != user_id {
            return Err(format!("Unauthorized to delete this customer").into());
        }
    } else {
        return Err(format!("Customer with id {} does not exist", id).into());
    }

    let _update_result = sqlx::query(
        r#"
        UPDATE gear_items
        SET customer_id = NULL
        WHERE customer_id = ?
        "#,
    )
    .bind(&id)
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to update gear items: {}", e))?;

    let _delete_customer_result = sqlx::query("DELETE FROM customers WHERE id = ?")
        .bind(&id)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to delete customer: {}", e))?;

    Ok(Json(id))
}

pub fn routes() -> Vec<rocket::Route> {
    routes![
        create_customer,
        list_customers,
        list_customer_locations,
        delete_customer,
        edit_customer
    ]
}
