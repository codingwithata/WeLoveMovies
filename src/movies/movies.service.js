const knex = require("../db/connection");
const addCritic = require("../utils/addCritic");

function list(isShowing) {
  if (isShowing === "true") {
    return listOnlyShowing();
  }
  return listAll();
}

function listAll() {
  return knex("movies").select("*");
}

function listOnlyShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.movie_id", "m.title", "m.runtime_in_minutes", "rating", "description", "image_url")
    .groupBy("m.movie_id")
    .where({ is_showing: true });
}

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

function listTheatersByMovieId(movieId) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .where({ "mt.movie_id": movieId })
    .select("*");
}

function listReviewsByMovieId(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .where({ "r.movie_id": movieId })
    .select(
      "r.*",
      "c.critic_id as critic.critic_id",
      "c.preferred_name as critic.preferred_name",
      "c.surname as critic.surname",
      "c.organization_name as critic.organization_name"
    )
    .then(addCritic);
}

module.exports = {
  list,
  read,
  listTheatersByMovieId,
  listReviewsByMovieId,
};
