const
  RF    = require('ramda-fantasy'),
  Const = require('../Const'),

  Either = RF.Either,
  Tuple  = RF.Tuple;


// `Forget` is a `Profunctor` that ignores its covariant type.
//
//:: Monoid m => Type m -> (a -> r) -> Forget r a b
const _Forget = M => function Forget(z) {
  return {
    runForget: z,
    dimap: (f, _) => Forget(x => z(f(x))),
    left:      () => Forget(Either.either(z, _ => M.empty())),
    right:     () => Forget(Either.either(_ => M.empty(), z)),
    first:     () => Forget(x => z(Tuple.fst(x))),
    second:    () => Forget(x => z(Tuple.snd(x))),
    wander:     f => Forget(s => f(Const(M).of, x => Const(M)(z(x)), s).getConst)
  }
};

module.exports = _Forget;
