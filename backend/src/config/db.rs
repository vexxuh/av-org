use rocket::fairing::AdHoc;
use rocket::tokio::sync::OnceCell;
use sqlx::SqlitePool;
use std::fs;
use std::path::Path;

static DB: OnceCell<SqlitePool> = OnceCell::const_new();

pub async fn init_db() -> Result<SqlitePool, sqlx::Error> {
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    // Create the database file if it doesn't exist
    if !Path::new(&database_url).exists() {
        fs::File::create(&database_url).expect("Failed to create database file");
    }

    SqlitePool::connect(&database_url).await
}

pub fn init() -> AdHoc {
    AdHoc::try_on_ignite("Database Migrations", |rocket| async {
        let pool = match init_db().await {
            Ok(pool) => pool,
            Err(e) => {
                eprintln!("Failed to initialize pool: {}", e);
                std::process::exit(1);
            }
        };

        if let Err(e) = crate::schema::user::create_user_table(&pool).await {
            eprintln!("Failed to create user table: {}", e);
            std::process::exit(1);
        }

        DB.set(pool).expect("Failed to set pool");
        Ok(rocket)
    })
}

pub async fn db() -> &'static SqlitePool {
    DB.get().expect("Database not initialized")
}
