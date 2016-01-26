const
  R  = require('ramda'),
  RF = require('ramda-fantasy'),

  Identity = RF.Identity;


//:: Applicative f => ((a -> f a) -> (a -> f b) -> s -> f t) -> p a b -> p s t
const wander = R.curry((t, p) => {
  if (typeof p.wander === 'function') return p.wander(t);
  if (typeof p        === 'function') return s => t(Identity, a => Identity(p(a)), s).value;
  throw new TypeError('Expected Wander instance');
});

module.exports = {
  wander
};
