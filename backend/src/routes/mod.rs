use crate::db::DbConn;
use crate::models::{NewUser, User};
use diesel::prelude::*;
use rocket::serde::json::Json;
use rocket::{get, post};

#[post("/users", data = "<user>")]
pub async fn create_user(conn: DbConn, user: Json<NewUser<'_>>) -> Json<User> {
    use crate::schema::users::dsl::*;

    conn.run(|c| {
        diesel::insert_into(users)
            .values(&*user)
            .execute(c)
            .expect("Error creating user");

        users.order(id.desc()).first(c).unwrap()
    })
    .await
}

#[get("/users")]
pub async fn get_users(conn: DbConn) -> Json<Vec<User>> {
    use crate::schema::users::dsl::*;

    conn.run(|c| users.load::<User>(c).unwrap()).await.into()
}
