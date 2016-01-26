const
  R        = require('ramda'),
  RF       = require('ramda-fantasy'),
  Choice   = require('./Internal/Profunctor/Class/Choice'),
  PF       = require('./Internal/Profunctor/Class/Profunctor'),
  Tagged   = require('./Internal/Profunctor/Tagged'),

  Either = RF.Either,
  Maybe  = RF.Maybe,
  Unit   = {};


//:: (b -> t) -> (s -> Either t a) -> Prism s t a b
const prism = R.curry((to, fro, pab) =>
  PF.dimap(fro, (e => e.value), Choice.right(PF.rmap(to, pab))));

//:: (a -> s) -> (s -> Maybe a) -> PrismP s a
const prism_ = R.curry((to, fro) =>
  prism(to, s => Maybe.maybe(Either.Left(s), Either.Right, fro(s))));

//:: Review s t a b -> b -> t
const review = R.curry((p, r) => p(Tagged(r)).unTagged);

//:: a -> (a -> Boolean) -> PrismP a Unit
const nearly = R.curry((x, f) =>
  prism_(() => x, a => f(a) ? Maybe.Just(Unit) : Maybe.Nothing()));

// only :: Eq a => a -> PrismP a Unit
const only = a =>
  prism_(() => a,
         x => R.equals(a, x) ? Maybe.Just(Unit)
                             : Maybe.Nothing());

//:: Prism (Either a c) (Either b c) a b
const _Left  = Choice.left;

//:: Prism (Either c a) (Either c b) a b
const _Right = Choice.right;

//:: Prism (Maybe a) (Maybe b) Unit Unit
const _Nothing = prism(
  () => Maybe.Nothing(),
  Maybe.maybe(Either.Right(Unit),
              () => Either.Left(Maybe.Nothing())));

//:: Prism (Maybe a) (Maybe b) a b
const _Just = prism(
  Maybe.Just,
  Maybe.maybe(Either.Left(Maybe.Nothing()),
              Either.Right));


module.exports = {
  prism,
  prism_,
  review,
  nearly,
  only,
  _Left,
  _Right,
  _Nothing,
  _Just
};
