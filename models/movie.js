const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    director: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    duration: {
      type: Number,
      min: 0,
      max: 300,
      required: true,
    },
    year: {
      type: String,
      length: 4,
      required: true,
    },
    description: {
      type: String,
      minlength: 1,
      maxlength: 2000,
      required: true,
    },
    image: {
      type: String,
      lowercase: true,
      required: true,
      validate: {
        validator(v) {
          return isURL(v);
        },
      },
    },
    trailer: {
      type: String,
      lowercase: true,
      required: true,
      validate: {
        validator(v) {
          return isURL(v);
        },
      },
    },
    thumbnail: {
      type: String,
      lowercase: true,
      required: true,
      validate: {
        validator(v) {
          return isURL(v);
        },
      },
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    nameEN: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('movie', movieSchema);
