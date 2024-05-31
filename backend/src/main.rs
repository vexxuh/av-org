#[macro_use]
extern crate rocket;

mod db;
mod models;
mod routes;
mod schema;

use db::DBConnect;
use rocket::routes;
use routes::{create_user, get_users};

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(DBConnect::fairing())
        .mount("/", routes![create_user, get_users])
}
