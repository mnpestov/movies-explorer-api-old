// require('dotenv').config();
// const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const { routes } = require('./routes');
const {
  createUser,
  login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const PORT = 3000;
const app = express();

// app.use(cors({
//   origin: [
//     'https://mnpestov.nomoredomains.rocks',
//     'http://mnpestov.nomoredomains.rocks',
//     'http://localhost:3001',
//   ],
// }));
// app.use(helmet());
app.use(requestLogger);

app.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);
app.use(auth);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

async function connect() {
  await mongoose.connect('mongodb://127.0.0.1:27017/movies-explorer-db ', {
    useNewUrlParser: true,
  });
  await app.listen(PORT);
}

connect();
