const
  R      = require('ramda'),
  jsv    = require('jsverify'),
  Getter = require('../src/Getter'),
  Iso    = require('../src/Iso');


module.exports = (iso, aArb, bArb, aEq, bEq) => {
  describe('Iso laws', () => {
    jsv.property('identity',
      aArb,
      a => aEq(Getter.view(R.compose(iso, Iso.re(iso)), a), a));

    jsv.property('reverse identity',
      bArb,
      b => bEq(Getter.view(R.compose(Iso.re(iso), iso), b), b));
  });
};
