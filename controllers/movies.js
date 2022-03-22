const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
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
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.send({ movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Ошибка валидации');
      }
      next(err);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const currentUser = req.user.id;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new BadRequestError('Нет фильма с таким id.');
      }
      if (currentUser.toString() !== movie.owner.toString()) {
        throw new ForbiddenError('вы не можете удалить этот фильм.');
      }
      Movie.deleteOne({ _id: movie._id })
        .then((deleteInfo) => {
          res.status(200).send({ deleteInfo });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Нет фильма с таким id.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
