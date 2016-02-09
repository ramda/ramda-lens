const
  R            = require('ramda'),
  jsv          = require('jsverify'),
  Tagged       = require('../../../src/Internal/Profunctor/Tagged'),
  isProfunctor = require('../../../laws/Profunctor'),

  TaggedArb = jsv.nat.smap(Tagged, t => t.unTagged),
  TaggedEq  = (p1, p2) => R.equals(p1.unTagged, p2.unTagged);


describe('Tagged', () => {
  isProfunctor(TaggedArb, TaggedEq);
});
