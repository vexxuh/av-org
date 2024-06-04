use sqlx::Executor;

pub async fn create_user_table(executor: impl Executor<'_>) -> Result<(), sqlx::Error> {
    executor
        .execute(
            "
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ",
        )
        .await?;
    Ok(())
}
