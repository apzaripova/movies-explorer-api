require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const Router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const { rateLimiter } = require('./middlewares/rateLimiter');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

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

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(rateLimiter);

app.use(requestLogger);

// подключаем краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(Router);

// обработчики ошибок
app.all('*', () => {
  throw new NotFoundError('На сервере произошла ошибка');
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер запущен на порту ${PORT}`);
});
