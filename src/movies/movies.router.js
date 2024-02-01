const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/:movieId/reviews").get(controller.readReviewsByMovieId).all(methodNotAllowed)
router.route("/:movieId/theaters").get(controller.readTheatersByMovieId).all(methodNotAllowed);
router.route("/:movieId").get(controller.read);
router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;
