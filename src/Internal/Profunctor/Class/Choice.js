const
  R  = require('ramda'),
  RF = require('ramda-fantasy'),
  C  = require('../../Category'),
  PF = require('./Profunctor'),

  Either = RF.Either;


// left :: Choice p => p a b -> p (Either a c) (Either b c)
const left = pab => {
  if (typeof pab.left === 'function') return pab.left();
  if (typeof pab      === 'function') return e => e.bimap(pab, x => x);
  throw new TypeError('Expected Choice instance');
};

// right :: Choice p => p b c -> p (Either a b) (Either a c)
const right = pbc => {
  if (typeof pbc.right === 'function') return pbc.right();
  if (typeof pbc       === 'function') return e => e.map(pbc);
  throw new TypeError('Expected Choice instance');
};

// choice :: Category p, Choice p => p a b -> p c d -> p (Either a c) (Either b d)
const choice = R.curry((c1, c2) => C.pipe(left(c1), right(c2)));

// join :: Category p, Choice p => p a c -> p b c -> p (Either a b) c
const join = R.curry((Cat, l, r) =>
  C.pipe(choice(l, r),
         PF.lmap(Either.either(x => x, x => x),
                 C.id(Cat))));

module.exports = {
  left,
  right,
  choice,
  join
};
