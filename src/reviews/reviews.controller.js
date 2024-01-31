const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);

  if (review) {
    res.locals.review = review;
    return next();
  }
  return next({ status: 404, message: `Review cannot be found` });
}

async function destroy(req, res) {
  const { review } = res.locals;
  await service.delete(review.review_id);
  res.sendStatus(204);
}

async function list(req, res) {
  const { movieId } = req.params;

  // If a movieId is provided, fetch reviews for that specific movie.
  if (movieId) {
    const reviews = await service.listReviewsForMovie(movieId);
    res.json({ data: reviews });
  } else {
    // If no movieId is provided, fetch all reviews.
    const reviews = await service.listAllReviews();
    res.json({ data: reviews });
  }
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(req, res) {
  const { review } = res.locals;
  const { update } = res.locals;
  await service.update(update, review.review_id);
  const updatedReview = await service.read(review.review_id);
  const critic = await service.getCritic(review.critic_id);

  res.status(200).json({ data: { ...updatedReview, critic: critic[0] } });
}
module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
