const
  jsv    = require('jsverify'),
  Getter = require('../src/Getter'),
  Setter = require('../src/Setter');


module.exports = (lens, sArb, vArb, sEq, vEq) => {
  const
    getter = Getter.view(lens),
    setter = Setter.set(lens);

  describe('Lens laws', () => {
    jsv.property('view then set',
                 sArb,
                 s => sEq(setter(getter(s), s), s));

    jsv.property('set then view',
                 sArb, vArb,
                 (s, v) => vEq(getter(setter(v, s)), v));

    jsv.property('set then set',
                 sArb, vArb, vArb,
                 (s, v1, v2) => vEq(getter(setter(v2, setter(v1, s))), v2));
  });
};
