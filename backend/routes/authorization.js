const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const validator = require('validator');

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

const {
  login, createUser,
} = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(2).max(30),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    password: Joi.string().min(2).max(30),
    email: Joi.string().required().min(2).max(30),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(method),
  }),
}), createUser);

module.exports = router;
