const
  R            = require('ramda'),
  RF           = require('ramda-fantasy'),
  jsv          = require('jsverify'),
  Star         = require('../../../src/Internal/Profunctor/Star'),
  isProfunctor = require('../../../laws/Profunctor'),

  IdentityArb = arb => arb.smap(RF.Identity, i => i.value),
  StarArb = arb => jsv.fn(IdentityArb(arb)).smap(Star(RF.Identity), s => s.runStar),

  StarEq  = arb => (p1, p2) => {
    const n = jsv.sampler(arb)();
    return R.equals(p1.runStar(n), p2.runStar(n));
  };


describe('Star', () => {
  isProfunctor(StarArb(jsv.nat), StarEq(jsv.nat));
});
