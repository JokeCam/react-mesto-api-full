const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const CastError = require('../errors/cast-err');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/authorization-err');
const MongoError = require('../errors/mongo-err');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.getUser = (req, res, next) => {
  User.findOne({ _id: req.params.userId })
    .orFail(new Error('NotFound'))
    .then((user) => res.send( user ))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } else if (err.name === 'CastError') {
        throw new CastError('Переданы некорректные данные при поиске пользователя');
      }
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .orFail(new Error('NotFound'))
    .then((user) => res.send( user ))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } else if (err.name === 'CastError') {
        throw new CastError('Переданы некорректные данные при поиске пользователя');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({ email: req.body.email, password: hash }))
    .then((user) => {
      let tempUser = user
      tempUser.password = 'private'
      res.send( tempUser )
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании пользователя.');
      } else if (err.name === 'MongoError' && err.code === 11000) {
        throw new MongoError('Переданы некорректные данные при создании пользователя.');
      }
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  if (name && about) {
    User.findByIdAndUpdate(req.user._id, { name, about },
      {
        new: true,
        runValidators: true,
      })
      .orFail(new Error('NotFound'))
      .then((user) => res.send( user ))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new CastError('Переданы некорректные данные при обновлении профиля.');
        } else if (err.message === 'NotFound') {
          throw new NotFoundError('Пользователь по указанному _id не найден.');
        }
      })
      .catch(next);
  } else next(new CastError('Переданы некорректные данные при обновлении профиля.'));
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar },
    {
      new: true,
      runValidators: true,
    })
    .orFail(new Error('NotFound'))
    .then((user) => res.send( user ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new CastError('Переданы некорректные данные при обновлении профиля.');
      } else if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password, next)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      const token = jwt.sign(
        { _id: user._id },
        require('../app').NODE_ENV === 'production' ? require('../app').JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send( user );
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
    res
    .status(200)
    .cookie('jwt', 'token', {
      maxAge: -1,
      httpOnly: true,
    })
    .send({ message: 'Авторизация прошла успешно' })
    .catch(next);
};
