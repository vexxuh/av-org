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
#[get("/<user_id>/locations")]
async fn list_customer_locations(
    user_id: String,
) -> Result<Json<Vec<CustomerWithLocations>>, String> {
    let pool: &SqlitePool = db().await;

    let query = r#"
          SELECT c.id, c.name, c.user_id, c.created_at, c.updated_at,
                 l.id AS location_id, l.name AS location_name, l.user_id AS location_user_id,
                 r.id AS room_id, r.name AS room_name, r.user_id AS room_user_id
          FROM customers c
          LEFT JOIN locations l ON c.id = l.customer_id
          LEFT JOIN rooms r ON l.id = r.location_id
          WHERE c.user_id = ?
          "#;

    let rows = sqlx::query_as::<_, QueryReturnCustomerLocations>(&query)
        .bind(&user_id)
        .fetch_all(pool)
        .await
        .map_err(|e| format!("Failed to fetch customers, locations, and rooms: {}", e))?;

    let mut customers_with_locations: Vec<CustomerWithLocations> = Vec::new();
    let mut customer_map: HashMap<String, CustomerWithLocations> = HashMap::new();
    let mut location_map: HashMap<String, LocationWithRooms> = HashMap::new();

    for row in rows {
        let room = if let (Some(room_id), Some(room_name)) =
            (row.room_id.clone(), row.room_name.clone())
        {
            Some(Room {
                id: Some(room_id),
                location_id: row.location_id.clone().unwrap_or_default(),
                user_id: row.room_user_id.clone().unwrap_or_default(),
                name: room_name,
                created_at: None,
                updated_at: None,
            })
        } else {
            None
        };

        let location_id = row.location_id.clone().unwrap_or_default();
        let customer_id = row.id.clone();

        if let Some(location) = location_map.get_mut(&location_id) {
            if let Some(r) = room {
                location.rooms.push(r);
            }
        } else {
            let mut rooms = Vec::new();
            if let Some(r) = room {
                rooms.push(r);
            }
            let location = LocationWithRooms {
                id: Some(location_id.clone()),
                customer_id: Some(customer_id.clone()),
                user_id: Some(row.user_id),
                name: row.location_name.clone().unwrap_or_default(),
                created_at: None,
                updated_at: None,
                rooms,
            };
            location_map.insert(location_id.clone(), location);
        }

        let location_ref = location_map.get(&location_id).unwrap().clone();

        if let Some(customer) = customer_map.get_mut(&customer_id) {
            if !customer.locations.iter().any(|l| l.id == location_ref.id) {
                customer.locations.push(location_ref);
            }
        } else {
            let mut locations = vec![];
            locations.push(location_ref);

            let customer_with_locations = CustomerWithLocations {
                id: customer_id.clone(),
                name: row.name.clone(),
                created_at: row.created_at,
                updated_at: row.updated_at,
                locations,
                user_id: user_id.clone(),
            };
            customer_map.insert(customer_id.clone(), customer_with_locations);
        }
    }

    for (_, customer) in customer_map {
        customers_with_locations.push(customer);
    }

    Ok(Json(customers_with_locations))
}

pub fn routes() -> Vec<rocket::Route> {
    routes![create_customer, list_customers, list_customer_locations]
}
