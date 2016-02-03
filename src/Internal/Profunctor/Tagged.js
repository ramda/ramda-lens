const
  RF    = require('ramda-fantasy'),
  Left  = RF.Either.Left,
  Right = RF.Either.Right;


// `Tagged` is a `Profunctor` that ignores its contravariant type.
//
// Tagged :: b -> Tagged a b
const Tagged = b => ({
  unTagged: b,
  dimap: (_, g) => Tagged(g(b)),
  left:      () => Tagged(Left(b)),
  right:     () => Tagged(Right(b))
});

module.exports = Tagged;
