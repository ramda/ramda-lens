const
  R  = require('ramda'),
  RF = require('ramda-fantasy'),
  PF = require('./Profunctor'),
  C  = require('../../Category'),

  Tuple = RF.Tuple;


// first :: Strong p => p a c -> p (Tuple a b) (Tuple c b)
const first = p => {
  if (typeof p.first === 'function') return p.first();
  if (typeof p       === 'function') return t => Tuple(p(Tuple.fst(t)), Tuple.snd(t));
  throw new TypeError('Expected Strong instance');
};

// second :: Strong p => p b c -> p (Tuple a b) (Tuple a c)
const second = p => {
  if (typeof p.second === 'function') return p.second();
  if (typeof p        === 'function') return R.map(p);
  throw new TypeError('Expected Strong instance');
};

// both :: Category p, Strong p => p a b -> p c d -> p (Tuple a c) (Tuple b d)
const both = R.curry((p1, p2) => C.pipe(first(p1), second(p2)));

// split :: Category p, Strong p => Type p -> p a b -> p a c -> p a (Tuple b c)
const split = R.curry((Cat, l, r) =>
  C.pipe(PF.rmap(a => Tuple(a, a), C.id(Cat)),
         both(l, r)));

module.exports = {
  first,
  second,
  both,
  split
};
