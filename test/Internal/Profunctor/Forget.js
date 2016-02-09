const
  R            = require('ramda'),
  jsv          = require('jsverify'),
  Forget       = require('../../../src/Internal/Profunctor/Forget'),
  Unit         = require('../../../src/Internal/Monoid/Unit'),
  isProfunctor = require('../../../laws/Profunctor'),

  ForgetArb = arb => jsv.fn(arb).smap(Forget(Unit), s => s.runForget),

  ForgetEq  = arb => (p1, p2) => {
    const n = jsv.sampler(arb)();
    return R.equals(p1.runForget(n), p2.runForget(n));
  };


describe('Forget', () => {
  isProfunctor(ForgetArb(jsv.nat), ForgetEq(jsv.nat));
});
