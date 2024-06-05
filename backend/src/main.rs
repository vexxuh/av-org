#[macro_use]
extern crate rocket;

mod config;
mod models;
mod routes;
mod schema;

use config::db;

use dotenv::dotenv;
use rocket::fairing::AdHoc;
use std::env;

#[launch]
fn rocket() -> _ {
    dotenv().ok();

    rocket::build()
        .attach(db::init())
        .mount("/api/v1/customer", routes::customer::routes())
        .mount("/api/v1/location", routes::location::routes())
        .mount("/api/v1/room", routes::room::routes())
        .mount("/api/v1/gear_item", routes::gear_item::routes())
}
