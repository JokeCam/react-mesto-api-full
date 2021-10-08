const Card = require('../models/card');

const CastError = require('../errors/cast-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CastError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .orFail(new NotFoundError('Карточка не найдена.'))
    .then((card) => {
      // eslint-disable-next-line eqeqeq
      if (card.owner == req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .orFail(new Error('NotFound'))
          .then(res.send({ data: card }))
          .catch((err) => {
            if (err.message === 'NotFound') {
              throw new NotFoundError('Карточка не найдена.');
            } else if (err.name === 'CastError') {
              throw new CastError('Переданы неверные данные');
            }
          });
      } else throw new ForbiddenError('Недостаточно прав для удаления карточки');
    })
    .catch(next);
};

module.exports.placeLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      } else if (err.name === 'CastError') {
        next(new CastError('Переданы некорректные данные для постановки лайка.'));
      } else {
        next(err);
      }
    });
};

module.exports.removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      } else if (err.name === 'CastError') {
        next(new CastError('Переданы некорректные данные для снятия лайка.'));
      } else {
        next(err);
      }
    });
};
