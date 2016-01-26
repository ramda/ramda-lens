const
  R      = require('ramda'),
  RF     = require('ramda-fantasy'),
  PF     = require('./Internal/Profunctor/Class/Profunctor'),
  Strong = require('./Internal/Profunctor/Class/Strong'),

  Maybe = RF.Maybe;
  Tuple = RF.Tuple;


//:: (s -> Tuple a (b -> t)) -> Lens s t a b
const lens_ = R.curry((to, pab) =>
  PF.dimap(to, t => Tuple.snd(t)(Tuple.fst(t)), Strong.first(pab)));

//:: (s -> a) -> (s -> b -> t) -> Lens s t a b
const lens = R.curry((getter, setter) =>
  lens_(s => Tuple(getter(s), b => setter(s, b))));

//:: Lens (Tuple a c) (Tuple b c) a b
const _1 = Strong.first;

//:: Lens (Tuple c a) (Tuple c b) a b
const _2 = Strong.second;

//:: String -> LensP (Object a) (Maybe a)
const atObject = k =>
  lens(obj => R.has(k, obj) ? Maybe.Just(obj[k]) : Maybe.Nothing(),
       (obj, m) => m.isJust ? R.assoc(k, m.value, obj) : R.dissoc(k, obj));

module.exports = {
  lens_,
  lens,
  _1,
  _2,
  atObject
};
