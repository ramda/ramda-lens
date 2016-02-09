const
  R     = require('ramda'),
  jsv   = require('jsverify'),
  natFn = jsv.fn(jsv.nat);


module.exports = (p, eq) => {
  describe('Profunctor laws', () => {
    jsv.property('identity',
                 p,
                 p => eq(p.dimap(R.identity, R.identity), p));

    jsv.property('composition',
                 natFn, natFn, natFn, natFn, p,
                 (f,    f_,    h,     h_,    p) =>
                   eq(p.dimap(R.compose(h, h_), R.compose(f_, f)),
                      p.dimap(h, f).dimap(h_, f_)));
  });
};
