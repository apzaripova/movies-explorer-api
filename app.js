require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const Router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { rateLimiter } = require('./middlewares/rateLimiter');
const { errorHandler } = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookieParser());
app.use(cors());
app.options('*', cors());

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(helmet());

app.use(requestLogger);
app.use(rateLimiter);

app.use(Router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listenting on port ${PORT}`);
});
