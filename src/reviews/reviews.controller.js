const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function checkReviewExist(req, res, next) {
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

async function destroy(req, res, next) {
  const id = Number(req.params.reviewId);
  await reviewsService.destroy(id);
  res.sendStatus(204);
}

async function update(req, res, next) {
  const originalReview = res.locals.review;
  const reviewUpdates = req.body.data;

  const revisedReview = {
    ...originalReview,
    ...reviewUpdates,
  };

  await reviewsService.update(revisedReview);
  const updatedReviewDetails = await reviewsService.read(
    revisedReview.review_id
  );
  updatedReviewDetails.critic = await reviewsService.getCriticById(
    revisedReview.critic_id
  );

  res.json({ data: updatedReviewDetails });
}

module.exports = {
  update: [asyncErrorBoundary(checkReviewExist), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(checkReviewExist), asyncErrorBoundary(destroy)],
};
