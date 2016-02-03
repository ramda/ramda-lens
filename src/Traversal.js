const
  R      = require('ramda'),
  Wander = require('./Internal/Profunctor/Class/Wander'),
  Star   = require('./Internal/Profunctor/Star');


// traversed :: Traversable t => Traversal (t a) (t b) a b
const traversed = p => Wander.wander(R.traverse, p);

// traverseOf :: Applicative f => Type f -> Optic (Star f) s t a b -> (a -> f b) -> s -> f t
const traverseOf = R.curry((F, t, afb, s) =>
  t(Star(F)(afb)).runStar(s));

// sequenceOf :: Applicative f => Type f -> Optic (Star f) s t (f a) a -> s -> f t
const sequenceOf = R.curry((F, t, s) =>
  traverseOf(F, t, x => x, s));

// ixArray :: Int -> TraversalP [a] a
const ixArray = n =>
  Wander.wander((of, coalg, xs) =>
    n >= 0 && n < xs.length ? R.map(x => R.update(n, x, xs), coalg(xs[n]))
                            : of(xs));

// ixObject :: String -> TraversalP (Object a) a
const ixObject = k =>
  Wander.wander((of, coalg, obj) =>
    obj.hasOwnProperty(k) ? R.map(v => R.assoc(k, v, obj), coalg(obj[k]))
                          : of(obj));

module.exports = {
  traversed,
  traverseOf,
  sequenceOf,
  ixArray,
  ixObject
};
