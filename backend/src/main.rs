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
        .mount("/users", routes::user::routes())
}
