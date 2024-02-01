const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function ifReviewExists(req, res, next) {
  const foundReview = await reviewsService.read(Number(req.params.reviewId));

  if (foundReview) {
    res.locals.review = foundReview;
    return next();
  }

  return next({
    status: 404,
    message: `Review cannot be found for id: ${req.params.reviewId}`,
  });
}

async function update(req, res, next) {
  const newReview = {
    ...res.locals.review,
    ...req.body.data,
  };

  await reviewsService.update(newReview);
  const updatedReview = await reviewsService.read(newReview.review_id);
  updatedReview.critic = await reviewsService.getCriticById(newReview.critic_id);
  res.json({ data: updatedReview });
}

async function destroy(req, res, next) {
  const id = Number(req.params.reviewId);
  await reviewsService.destroy(id);
  res.sendStatus(204);
}

module.exports = {
  update: [asyncErrorBoundary(ifReviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(ifReviewExists), asyncErrorBoundary(destroy)],
};
