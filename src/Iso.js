const
  R          = require('ramda'),
  RF         = require('ramda-fantasy'),
  Fold       = require('./Fold'),
  Prism      = require('./Prism'),

  Exchange   = require('./Internal/Profunctor/Exchange'),
  Re         = require('./Internal/Profunctor/Re'),
  Profunctor = require('./Internal/Profunctor/Class/Profunctor'),

  Maybe = RF.Maybe,
  Unit  = {};


// iso :: (s -> a) -> (b -> t) -> Iso s t a b
const iso = Profunctor.dimap;

// re :: Optic (Re p a b) s t a b -> Optic p b a t s
const re = p =>
  p(Re(x => x)).runRe;

// withIso :: Iso s t a b -> ((s -> a) -> (b -> t) -> r) -> r
const withIso = R.curry((p, f) => {
  const ex = p(Exchange(x => x, x => x));
  return f(ex.runTo, ex.runFro);
});

// under :: Iso s t a b -> (t -> s) -> b -> a
const under = R.curry((p, ts, b) =>
  withIso(p, (sa, bt) => sa(ts(bt(b)))));

// non_ :: PrismP a Unit -> IsoP (Maybe a) a
const non_ = p =>
  iso(m => m.isJust ? m.value : Prism.review(p, Unit),
      b => Fold.has(p, b) ? Maybe.Nothing() : Maybe.Just(b));

// non :: Eq a => a -> IsoP (Maybe a) a
const non = R.compose(non_, Prism.only);

module.exports = {
  iso,
  re,
  withIso,
  under,
  non_,
  non
};
