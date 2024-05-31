use rocket_sync_db_pools::{database, diesel};

#[database("sqlite_database")]
pub struct DbConn(diesel::SqliteConnection);
