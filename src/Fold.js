const
  R  = require('ramda'),
  RF = require('ramda-fantasy'),

  Either = RF.Either,
  Maybe  = RF.Maybe,
  Tuple  = RF.Tuple,

  Additive       = require('./Internal/Monoid/Additive'),
  Conj           = require('./Internal/Monoid/Conj'),
  Disj           = require('./Internal/Monoid/Disj'),
  Dual           = require('./Internal/Monoid/Dual'),
  Endo           = require('./Internal/Monoid/Endo'),
  First          = require('./Internal/Monoid/First'),
  Last           = require('./Internal/Monoid/Last'),
  Multiplicative = require('./Internal/Monoid/Multiplicative'),
  Profunctor     = require('./Internal/Profunctor/Class/Profunctor'),
  Choice         = require('./Internal/Profunctor/Class/Choice'),
  Forget         = require('./Internal/Profunctor/Forget'),
  Star           = require('./Internal/Profunctor/Star');


const Unit = {};

// _apR :: Apply f => f a -> f b -> f b -- (*>)
const _apR = R.curry((lAp, rAp) =>
  lAp.map(_ => R.identity).ap(rAp));

// foldMapOf :: Monoid m => Type m -> Fold m s t a b -> (a -> m) -> s -> m
const foldMapOf = R.curry((M, p, f, s) =>
  p(Forget(M)(f)).runForget(s));

// foldOf :: Monoid m => Type m -> Fold m s t m b -> s -> m
const foldOf = R.curry((M, p, s) =>
  p(Forget(M)(x => x)).runForget(s));

// preview :: Fold (First a) s t a b -> s -> Maybe a
const preview = R.curry((p, s) =>
  foldMapOf(First, p, R.compose(First, Maybe.Just), s).first);

// foldrOf :: Fold (Endo r) s t a b -> (a -> r -> r) -> r -> s -> r
const foldrOf = R.curry((p, f, r, s) =>
  foldMapOf(Endo, p, x => Endo(f(x)), s).runEndo(r));

// foldlOf :: Fold (Dual (Endo r)) s t a b -> (r -> a -> r) -> r -> s -> r
const foldlOf = R.curry((p, f, r, s) =>
  foldMapOf(Dual(Endo), p, R.compose(Dual(Endo), Endo, R.flip(f)), s).dual.runEndo(r));

// allOf :: Fold (Conj Boolean) s t a b -> (a -> Boolean) -> s -> Boolean
const allOf = R.curry((p, f, s) =>
  foldMapOf(Conj, p, R.compose(Conj, f), s).toBool);

// anyOf :: Fold (Disj Boolean) s t a b -> (a -> Boolean) -> s -> Boolean
const anyOf = R.curry((p, f, s) =>
  foldMapOf(Disj, p, R.compose(Disj, f), s).toBool);

// andOf :: Fold (Conj Boolean) s t Boolean b -> s -> Boolean
const andOf = R.curry((p, s) => allOf(p, R.identity, s));

// orOf :: Fold (Disj Boolean) s t Boolean b -> s -> Boolean
const orOf = R.curry((p, s) => anyOf(p, R.identity, s));

// elemOf :: Eq a => Fold (Disj Boolean) s t a b -> a -> s -> Boolean
const elemOf = R.curry((p, a, s) =>
  anyOf(p, R.equals(a), s));

// notElemOf :: Eq a => Fold (Conj Boolean) s t a b -> a -> s -> Boolean
const notElemOf = R.curry((p, a, s) =>
  allOf(p, x => !R.equals(a, x), s));

// sumOf :: Fold (Additive Number) s t Number b -> s -> Number
const sumOf = R.curry((p, s) =>
  foldMapOf(Additive, p, Additive, s).toNum);

// productOf :: Fold (Multiplicative Number) s t Number b -> s -> Number
const productOf = R.curry((p, s) =>
  foldMapOf(Multiplicative, p, Multiplicative, s).toNum);

// lengthOf :: Fold (Additive Int) s t a b -> s -> Int
const lengthOf = R.curry((p, s) =>
  foldMapOf(Additive, p, () => Additive(1), s).toNum);

// firstOf :: Fold (First a) s t a b -> s -> Maybe a
const firstOf = R.curry((p, s) =>
  foldMapOf(First, p, R.compose(First, Maybe.Just), s).first);

// lastOf :: Fold (Last a) s t a b -> s -> Maybe a
const lastOf = R.curry((p, s) =>
  foldMapOf(Last, p, R.compose(Last, Maybe.Just), s).last);

// maximumOf :: Ord a => Fold (Endo (Maybe a)) s t a b -> s -> Maybe a
const maximumOf = R.curry((p, s) =>
  foldrOf(p, R.curry((a, m) => Maybe.Just(Maybe.maybe(a, R.max(a), m))), Maybe.Nothing(), s));

// minimumOf :: Ord a => Fold (Endo (Maybe a)) s t a b -> s -> Maybe a
const minimumOf = R.curry((p, s) =>
  foldrOf(p, a => m => Maybe.Just(Maybe.maybe(a, R.min(a), m)), Maybe.Nothing(), s));

// findOf :: Fold (Endo (Maybe a)) s t a b -> (a -> Boolean) -> s -> Maybe a
const findOf = R.curry((p, f, s) =>
  foldlOf(p, R.curry((m, a) => m.isJust ? m
                                        : f(a) ? Maybe.Just(a)
                                               : Maybe.Nothing()), Maybe.Nothing(), s));

// sequenceOf_ :: Applicative f => Type f -> Fold (Endo (f Unit)) s t (f a) b -> s -> f Unit
const sequenceOf_ = R.curry((fType, p, s) =>
  foldMapOf(Endo, p, R.compose(Endo, _apR), s).runEndo(fType.of(Unit)));

// toListOf :: Fold (Endo [a]) s t a b -> s -> [a]
const toListOf = R.curry((p, s) =>
  foldrOf(p, R.prepend, [], s));

// has :: Fold (Disj Boolean) s t a b -> s -> Boolean
const has = R.curry((p, s) =>
  foldMapOf(Disj, p, () => Disj(true), s).toBool);

// hasnt :: Fold (Conj Boolean) s t a b -> s -> Boolean
const hasnt = R.curry((p, s) =>
  foldMapOf(Conj, p, () => Conj(false), s).toBool);

// filtered :: Choice p => (a -> Boolean) -> OpticP p a a
const filtered = R.curry((f, c) =>
  Profunctor.dimap(R.ifElse(f, Either.Right, Either.Left), e => e.value, Choice.right(c)));

module.exports = {
  foldMapOf,
  foldOf,
  preview,
  foldrOf,
  foldlOf,
  andOf,
  orOf,
  elemOf,
  notElemOf,
  sumOf,
  productOf,
  lengthOf,
  firstOf,
  lastOf,
  maximumOf,
  minimumOf,
  findOf,
  sequenceOf_,
  toListOf,
  has,
  hasnt,
  filtered
};
