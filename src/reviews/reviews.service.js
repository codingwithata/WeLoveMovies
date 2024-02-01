const knex = require("../db/connection");
const addCritic = require("../utils/addCritic");

function update(newReview) {
  return knex("reviews")
    .where({ review_id: newReview.review_id })
    .update(newReview, ["*"])
    .then((data) => data[0]);
}

function read(reviewId) {
  return knex("reviews").select("*").where({ review_id: reviewId }).first();
}

function getCriticById(criticId) {
  return knex("critics").select("*").where({ critic_id: criticId }).first();
}

function destroy(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).del();
}

module.exports = {
  update,
  read,
  getCriticById,
  destroy,
};
