const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function ifMovieExists(req, res, next) {
  const foundMovie = await moviesService.read(req.params.movieId);
  if (foundMovie) {
    res.locals.movie = foundMovie;
    return next();
  }

  return next({
    status: 404,
    message: `Movie does not exist for id: ${req.params.movieId}`,
  });
}

async function list(req, res, next) {
  const data = await moviesService.list(req.query.is_showing);
  res.json({ data });
}

async function read(req, res, next) {
  res.json({ data: res.locals.movie });
}

async function readTheatersByMovieId(req, res, next) {
  const data = await moviesService.listTheatersByMovieId(Number(req.params.movieId));
  res.json({ data });
}

async function readReviewsByMovieId(req, res, next) {
  const data = await moviesService.listReviewsByMovieId(Number(req.params.movieId));
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [ifMovieExists, read],
  readTheatersByMovieId: [ifMovieExists, asyncErrorBoundary(readTheatersByMovieId)],
  readReviewsByMovieId: [ifMovieExists, asyncErrorBoundary(readReviewsByMovieId)],
};
