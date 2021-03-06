require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const auth = require('./middlewares/auth');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const errorHandler = require('./middlewares/error-handler');

const userController = require('./controllers/users');

const { PORT = 3000 } = process.env;
const { NODE_ENV = 'development' } = process.env;
const { JWT_SECRET = 'some-secret-key' } = process.env;

module.exports = {
  JWT_SECRET,
  NODE_ENV,
};

const NotFoundError = require('./errors/not-found-err');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);
app.use(limiter);
app.use(cors({
  origin: [
    'https://mesto.stanislav.nomoredomains.club',
    'http://mesto.stanislav.nomoredomains.club',
  ],
  credentials: true,
}));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signout', userController.logout);
app.use('/', require('./routes/authorization'));

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {

});
