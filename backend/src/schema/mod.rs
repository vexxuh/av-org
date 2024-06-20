use sqlx::Executor;

pub async fn create_tables(executor: impl Executor<'_>) -> Result<(), sqlx::Error> {
    executor
        .execute(
            "
        CREATE TABLE IF NOT EXISTS customers (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            user_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );

        CREATE TABLE IF NOT EXISTS locations (
            id TEXT PRIMARY KEY NOT NULL,
            customer_id TEXT NOT NULL,
            name TEXT NOT NULL,
            user_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        );

        CREATE TABLE IF NOT EXISTS rooms (
            id TEXT PRIMARY KEY NOT NULL,
            location_id TEXT NOT NULL,
            name TEXT NOT NULL,
            user_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
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
            user_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            FOREIGN KEY (room_id) REFERENCES rooms(id),
            FOREIGN KEY (customer_id) REFERENCES customers(id),
            FOREIGN KEY (location_id) REFERENCES locations(id)
        );

        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY NOT NULL,
            email TEXT NOT NULL UNIQUE,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );

        DROP TRIGGER IF EXISTS update_customers_updated_at;
        DROP TRIGGER IF EXISTS update_locations_updated_at;
        DROP TRIGGER IF EXISTS update_rooms_updated_at;
        DROP TRIGGER IF EXISTS update_gear_items_updated_at;
        DROP TRIGGER IF EXISTS update_users_updated_at;

        CREATE TRIGGER update_customers_updated_at
        AFTER UPDATE ON customers
        FOR EACH ROW
        BEGIN
            UPDATE customers
            SET updated_at = CURRENT_TIMESTAMP
            WHERE id = old.id;
        END;

        CREATE TRIGGER update_locations_updated_at
        AFTER UPDATE ON locations
        FOR EACH ROW
        BEGIN
            UPDATE locations
            SET updated_at = CURRENT_TIMESTAMP
            WHERE id = old.id;
        END;

        CREATE TRIGGER update_rooms_updated_at
        AFTER UPDATE ON rooms
        FOR EACH ROW
        BEGIN
            UPDATE rooms
            SET updated_at = CURRENT_TIMESTAMP
            WHERE id = old.id;
        END;

        CREATE TRIGGER update_gear_items_updated_at
        AFTER UPDATE ON gear_items
        FOR EACH ROW
        BEGIN
            UPDATE gear_items
            SET updated_at = CURRENT_TIMESTAMP
            WHERE id = old.id;
        END;

        CREATE TRIGGER update_users_updated_at
        AFTER UPDATE ON users
        FOR EACH ROW
        BEGIN
            UPDATE users
            SET updated_at = CURRENT_TIMESTAMP
            WHERE id = old.id;
        END;
        ",
        )
        .await?;
    Ok(())
}
