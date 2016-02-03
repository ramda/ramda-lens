const
  R = require('ramda'),
  C = require('../../Category');


// dimap :: Profunctor p => (a -> b) -> (c -> d) -> p b c -> p a d
const dimap = R.curry((a2b, c2d, pbc) => {
  if (typeof pbc.dimap === 'function') return pbc.dimap(a2b, c2d);
  if (typeof pbc       === 'function') return a => c2d(pbc(a2b(a)));
  throw new TypeError('Expected Profunctor');
});

// lmap :: Profunctor p => (a -> b) -> p b c -> p a c
const lmap = R.curry((a2b, pbc) => {
  if (typeof pbc.lmap  === 'function') return pbc.lmap(a2b);
  if (typeof pbc.dimap === 'function') return dimap(a2b, x => x, pbc);
  if (typeof pbc       === 'function') return a => pbc(a2b(a));
  throw new TypeError('Expected Profunctor');
});

// rmap :: Profunctor p => (b -> c) -> p a b -> p a c
const rmap = R.curry((b2c, pab) => {
  if (typeof pab.rmap  === 'function') return pab.rmap(b2c);
  if (typeof pab.dimap === 'function') return dimap(x => x, b2c, pab);
  if (typeof pab       === 'function') return a => b2c(pab(a));
  throw new TypeError('Expected Profunctor');
});

// arr :: Category p, Profunctor p => (a -> b) -> p a b
const arr  = R.curry((Cat, f) => rmap(f, C.id(Cat)));

module.exports = {
  dimap,
  lmap,
  rmap,
  arr
};
