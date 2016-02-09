const
  R         = require('ramda'),
  RF        = require('ramda-fantasy'),
  jsv       = require('jsverify'),
  Iso       = require('../src/Iso'),
  Lens      = require('../src/Lens'),
  Prism     = require('../src/Prism'),
  Getter    = require('../src/Getter'),
  Traversal = require('../src/Traversal'),

  negateIso = Iso.iso(n => n === 0 ? 0 : -n,
                      n => n === 0 ? 0 : -n);


describe('Getter', () => {

  describe('view', () => {
    jsv.property('view lens',
                 jsv.json, jsv.json,
                 (a, b) => R.equals(Getter.view(Lens._1, RF.Tuple(a, b)), a));

    jsv.property('view iso',
                 jsv.nat,
                 n => R.equals(Getter.view(negateIso, n + 1), -(n + 1)));
  });

});
