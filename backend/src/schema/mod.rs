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
            customer_id TEXT NOT NULL,
            location_id TEXT NOT NULL,
            manufacturer TEXT NOT NULL,
            device_model TEXT NOT NULL,
            serial_number TEXT NOT NULL,
            hostname TEXT NOT NULL,
            firmware TEXT NOT NULL,
            password TEXT NOT NULL,
            primary_mac TEXT NOT NULL,
            primary_ip TEXT NOT NULL,
            secondary_mac TEXT NOT NULL,
            secondary_ip TEXT NOT NULL,
            FOREIGN KEY (room_id) REFERENCES rooms(id),
            FOREIGN KEY (customer_id) REFERENCES customers(id)
            FOREIGN KEY (location_id) REFERENCES locations(id)
        );
        ",
        )
        .await?;
    Ok(())
}
