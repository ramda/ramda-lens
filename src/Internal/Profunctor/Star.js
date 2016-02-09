const
  R = require('ramda'),
  RF = require('ramda-fantasy'),

  Either = RF.Either,
  Tuple = RF.Tuple;


// `Star` lifts a `Functor` into a `Profunctor`. The `Applicative` constraint is
// only necessary to implement `Choice` and `Wander`.
//
// _Star :: Applicative f => Type f -> (a -> f b) -> Star f a b
const _Star = F => function Star(afb) {
  return {
    runStar: afb,
    dimap: (f, g) => Star(a => R.map(g, afb(f(a)))),
    first:     () => Star(t => R.map(a => Tuple(a, Tuple.snd(t)), afb(Tuple.fst(t)))),
    second:    () => Star(t => R.map(a => Tuple(Tuple.fst(t), a), afb(Tuple.snd(t)))),
    left:      () => Star(Either.either(a => R.map(Either.Left, afb(a)),
                                        a => F.of(Either.Right(a)))),
    right:     () => Star(Either.either(a => F.of(Either.Left(a)),
                                        a => R.map(Either.Right, afb(a)))),
    wander:     t => Star(a => t(F.of, afb, a))
  }
};

module.exports = _Star;
