const
  R         = require('ramda'),
  RF        = require('ramda-fantasy'),
  jsv       = require('jsverify'),
  Fold      = require('../src/Fold'),
  Lens      = require('../src/Lens'),
  Setter    = require('../src/Setter'),
  Traversal = require('../src/Traversal'),
  Additive  = require('../src/Internal/Monoid/Additive'),

  TupleArb = (lArb, rArb) =>
    jsv.pair(lArb, rArb).smap(p => RF.Tuple(p[0], p[1]),
                              t => [RF.Tuple.fst(t), RF.Tuple.snd(t)]);


describe('Traversal', () => {

  describe('traversed', () => {
    jsv.property('composition',
                 jsv.array(TupleArb(jsv.array(jsv.nat), jsv.nat)),
                 xs => {
                   const
                     l = R.compose(Traversal.traversed, Lens._1, Traversal.traversed),
                     lhs = Setter.over(l, R.inc, xs),
                     rhs = R.map(t => RF.Tuple(R.map(R.inc, RF.Tuple.fst(t)), RF.Tuple.snd(t)), xs);
                   return R.equals(lhs, rhs);
                 });

    jsv.property('over',
                 jsv.fn(jsv.nat), jsv.array(jsv.nat),
                 (f, xs) => R.equals(R.map(f, xs), Setter.over(Traversal.traversed, f, xs)));

    jsv.property('foldOf',
                 jsv.nearray(jsv.nat),
                 xs => R.equals(R.sum(xs),
                                Fold.foldOf(Additive, Traversal.traversed, R.map(Additive, xs)).toNum));
  });

  describe('traverseOf', () => {
    jsv.property('traverseOf',
                 jsv.array(jsv.nat), jsv.string,
                 xs => {
                   const lhs = R.traverse(RF.Identity.of, RF.Identity.of, xs);
                   const rhs = Traversal.traverseOf(RF.Identity,
                                                    Traversal.traversed,
                                                    RF.Identity.of,
                                                    xs);
                   return R.equals(lhs, rhs);
                 });
  });

  describe('sequenceOf', () => {
    jsv.property('sequenceOf',
                 jsv.array(jsv.nat), jsv.string,
                 xs => {
                   const ixs = R.map(RF.Identity, xs);
                   const lhs = R.sequence(RF.Identity.of, ixs);
                   const rhs = Traversal.sequenceOf(RF.Identity, Traversal.traversed, ixs);
                   return R.equals(lhs, rhs);
                 });
  });

  describe('ixArray', () => {
    jsv.property('in-bounds index',
                 jsv.json, jsv.array(jsv.json),
                 (x, xs) => R.equals(Fold.preview(Traversal.ixArray(xs.length), R.append(x, xs)),
                                     RF.Maybe.Just(x)));

    jsv.property('out-of-bounds index',
                 jsv.array(jsv.json),
                 xs => R.equals(Fold.preview(Traversal.ixArray(xs.length), xs),
                                RF.Maybe.Nothing()));
  });

  describe('ixObject', () => {
    jsv.property('with key',
                 jsv.asciistring, jsv.json, jsv.dict(jsv.json),
                 (k, v, obj) => R.equals(Fold.preview(Traversal.ixObject(k), R.assoc(k, v, obj)),
                                RF.Maybe.Just(v)));

    jsv.property('without key',
                 jsv.asciistring, jsv.dict(jsv.json),
                 (k, obj) => R.equals(Fold.preview(Traversal.ixObject(k), R.dissoc(k, obj)),
                   RF.Maybe.Nothing()));
  });

});
