use sqlx::Executor;

pub async fn create_tables(executor: impl Executor<'_>) -> Result<(), sqlx::Error> {
    executor
        .execute(
            "
        CREATE TABLE IF NOT EXISTS customers (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS locations (
            id TEXT PRIMARY KEY NOT NULL,
            customer_id TEXT NOT NULL,
            name TEXT NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        );

        CREATE TABLE IF NOT EXISTS rooms (
            id TEXT PRIMARY KEY NOT NULL,
            location_id TEXT NOT NULL,
            name TEXT NOT NULL,
            FOREIGN KEY (location_id) REFERENCES locations(id)
        );

        CREATE TABLE IF NOT EXISTS gear_items (
            id TEXT PRIMARY KEY NOT NULL,
            room_id TEXT NOT NULL,
            gear_name TEXT NOT NULL,
            mac_address TEXT NOT NULL,
            ip_address TEXT NOT NULL,
            FOREIGN KEY (room_id) REFERENCES rooms(id)
        );
        ",
        )
        .await?;
    Ok(())
}
