require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const Router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const { rateLimiter } = require('./middlewares/rateLimiter');
const { PORT, DB_ADDRESS } = require('./config');

const app = express();

const whiteList = ['https://movies-explorer.kinopoisk.nomoredomains.rocks',
  'http://movies-explorer.kinopoisk.nomoredomains.rocks'];

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    }
  },
  credentials: true,
};

app.use('*', cors(corsOptions));

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('/', express.json());

app.use(requestLogger);

app.use(helmet());

app.use(rateLimiter);

// подключаем краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', Router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
