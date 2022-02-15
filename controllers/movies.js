const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const Movie = require('../models/movie');

exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .populate('owner')
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    owner: req.user._id,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(200).send(movie))
    .catch(next);
};

exports.deleteMovie = (req, res, next) => {
  Movie.findOne({ movieId: req.params.movieId })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден');
      }
      if (String(movie.owner) !== req.user._id) {
        throw new BadRequestError('Вы не можете удалить чужой фильм');
      }
      return Movie.findOneAndDelete({ movieId: req.params.movieId })
        .then((userMovie) => res.status(200).send(userMovie));
    })
    .catch(next);
};
