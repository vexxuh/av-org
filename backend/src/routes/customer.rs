use crate::db::db;
use crate::models::customer::Customer;
use rocket::serde::json::Json;
use rocket::{delete, get, post, put};
use sqlx::SqlitePool;
use uuid::Uuid;

#[post("/", data = "<customer>")]
async fn create_customer(customer: Json<Customer>) -> Result<Json<Customer>, String> {
    let pool: &SqlitePool = db().await;
    let new_customer = customer.into_inner();
    let new_id = Uuid::new_v4();

    let _result = sqlx::query("INSERT INTO customers (id, name) VALUES (?, ?)")
        .bind(new_id.to_string())
        .bind(&new_customer.name)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to create customer: {}", e))?;

    let sql = format!(
        r#"
        SELECT id, name FROM customers WHERE id = '{}'
        "#,
        new_id
    );

    let created_customer = sqlx::query_as(&sql)
        .fetch_one(pool)
        .await
        .map_err(|e| format!("Failed to fetch created customer: {}", e))?;

    Ok(Json(created_customer))
}

pub fn routes() -> Vec<rocket::Route> {
    routes![create_customer]
}
