const
  R     = require('ramda'),
  RF    = require('ramda-fantasy'),
  jsv   = require('jsverify'),
  Fold  = require('../src/Fold'),
  Prism = require('../src/Prism');


// inPrismArb must generate a value `s` where `preview(prism, s)` results in a `Just`
module.exports = (prism, aArb, inPrismArb, sEq) => {
  describe('Prism laws', () => {
    jsv.property('review then preview',
                 aArb,
                 a => RF.Maybe.maybe(false,
                                     R.equals(a),
                                     Fold.preview(prism, Prism.review(prism, a))));

    jsv.property('partial iso',
                 inPrismArb,
                 s => RF.Maybe.maybe(false,
                                     a => sEq(s, Prism.review(prism, a)),
                                     Fold.preview(prism, s)));
  });
};
