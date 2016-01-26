const
  R         = require('ramda'),
  RF        = require('ramda-fantasy'),
  jsv       = require('jsverify'),
  Iso       = require('../src/Iso'),
  Lens      = require('../src/Lens'),
  Prism     = require('../src/Prism'),
  Setter    = require('../src/Setter'),
  Traversal = require('../src/Traversal'),

  negateIso = Iso.iso(n => n === 0 ? 0 : -n,
                      n => n === 0 ? 0 : -n),

  EitherArb = (lArb, rArb) => jsv.either(lArb, rArb).smap(e => e.either(RF.Either.Left, RF.Either.Right),
                                                          e => e.either(jsv.left, jsv.right));


describe('Setter', () => {

  describe('over', () => {
    jsv.property('over lens',
                 jsv.json, jsv.json, jsv.fn(jsv.json),
                 (a, b, fn) =>
                   R.equals(Setter.over(Lens._1, fn, RF.Tuple(a, b)), RF.Tuple(fn(a), b)));

    jsv.property('over member of prism',
                 jsv.json, jsv.fn(jsv.json),
                 (a, fn) =>
                   R.equals(Setter.over(Prism._Right, fn, RF.Either.Right(a)), RF.Either.Right(fn(a))));

    jsv.property('over non-member of prism',
                 jsv.json, jsv.fn(jsv.json),
                 (a, fn) =>
                   R.equals(Setter.over(Prism._Left, fn, RF.Either.Right(a)), RF.Either.Right(a)));

    jsv.property('over traversal',
                 jsv.array(jsv.nat), jsv.fn(jsv.nat),
                 (xs, fn) =>
                   R.equals(Setter.over(Traversal.traversed, fn, xs), R.map(fn, xs)));

    jsv.property('over iso',
                 jsv.nat,
                 n => R.equals(Setter.over(negateIso, R.inc, n), n - 1));
  });

  describe('set', () => {
    jsv.property('set',
                 jsv.json, jsv.json, jsv.json,
                 (a, b, c) =>
                   R.equals(Setter.set(Lens._1, c, RF.Tuple(a, b)), RF.Tuple(c, b)));
  });

  describe('mapped', () => {
    jsv.property('mapped',
                 jsv.json, EitherArb(jsv.string, jsv.nat), jsv.fn(jsv.nat),
                 (a, e, fn) => R.equals(Setter.over(R.compose(Lens._2, Setter.mapped), fn, RF.Tuple(a, e)),
                               RF.Tuple(a, R.map(fn, e))));
  });

});
