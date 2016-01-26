const
  R         = require('ramda'),
  RF        = require('ramda-fantasy'),
  jsv       = require('jsverify'),
  Traversal = require('../src/Traversal'),

  Compose = (F, G) => {
    function _Compose(x) {
      return {
        map: f => _Compose(R.map(R.map(f), x)),
        ap:  y => _Compose(R.ap(R.map(R.ap, x), y.value)),
        getCompose: x
      };
    }
    _Compose.of = x => _Compose(F.of(G.of(x)));
    return _Compose;
  },

  //  IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
  IdentityArb = arb => arb.smap(RF.Identity, i => i.value),

  fnIdentityArb = jsv.fn(IdentityArb(jsv.nat));


module.exports = t => {
  describe('Traversal laws', () => {
    jsv.property('identity',
                 jsv.array(jsv.nat),
                 xs => R.equals(Traversal.traverseOf(RF.Identity, t, RF.Identity.of, xs),
                                RF.Identity.of(xs)));

    jsv.property('composition',
                 fnIdentityArb, fnIdentityArb, jsv.array(jsv.nat),
                 (f, g, xs) => {
                   const C   = Compose(RF.Identity, RF.Identity);
                   const lhs = R.map(Traversal.traverseOf(RF.Identity, t, f),
                                     Traversal.traverseOf(RF.Identity, t, g, xs));
                   const rhs = Traversal.traverseOf(C, t, a => C(R.map(f, g(a))), xs).getCompose;
                   return R.equals(lhs, rhs);
                 });
  });
};
