const
  R = require('ramda');

//:: Setter s t a b -> (a -> b) -> s -> t
const over = R.curry((l, f, s) => l(f)(s));

//:: Setter s t a b -> b -> s -> t
const set = R.curry((l, b, s) => over(l, _ => b, s));

//:: Functor f => Setter (f a) (f b) a b
const mapped = R.map;

module.exports = {
  over,
  set: set, // `set` doesn't play nicely with object shorthand syntax
  mapped
};
