const
  R           = require('ramda'),
  RF          = require('ramda-fantasy'),
  jsv         = require('jsverify'),
  isPrism     = require('../laws/Prism'),
  isTraversal = require('../laws/Traversal'),
  Cons        = require('../src/Cons'),

  //:: Tuple a b -> Tuple b a
  swapTuple = t => RF.Tuple(RF.Tuple.snd(t), RF.Tuple.fst(t)),

  //:: Arbitrary a -> Arbitrary (Tuple a [a])
  ConsArb = arb =>
    jsv.pair(arb, jsv.array(arb)).smap(pair => RF.Tuple(pair[0], pair[1]),
                                       t => [RF.Tuple.fst(t), RF.Tuple.snd(t)]),
  //:: Arbitrary a -> Arbitrary (Tuple [a] a)
  SnocArb = arb =>
    ConsArb(arb).smap(swapTuple, swapTuple);

describe('Cons', () => {

  describe('cons', () => {
    jsv.property('cons', jsv.nat, jsv.array(jsv.nat), (x, xs) => {
      const xss = Cons.cons(x, xs);
      return R.equals(R.head(xss), x) && R.equals(R.tail(xss), xs);
    });
  });

  describe('uncons', () => {
    jsv.property('non-empty list', jsv.nat, jsv.array(jsv.nat), (x, xs) =>
      R.equals(Cons.uncons(R.prepend(x, xs)), RF.Maybe.Just(RF.Tuple(x, xs))));

    jsv.property('empty list', () =>
      R.equals(Cons.uncons([]), RF.Maybe.Nothing()));
  });

  describe('snoc', () => {
    jsv.property('snoc', jsv.array(jsv.nat), jsv.nat, (xs, x) => {
      const xss = Cons.snoc(xs, x);
      return R.equals(R.init(xss), xs) && R.equals(R.last(xss), x);
    });
  });

  describe('unsnoc', () => {
    jsv.property('non-empty list', jsv.array(jsv.nat), jsv.nat, (xs, x) =>
      R.equals(Cons.unsnoc(R.append(x, xs)), RF.Maybe.Just(RF.Tuple(xs, x))));

    jsv.property('empty list', () =>
      R.equals(Cons.unsnoc([]), RF.Maybe.Nothing()));
  });

  describe('_Cons', () => {
    isPrism(Cons._Cons, ConsArb(jsv.nat), jsv.nearray(jsv.nat), R.equals);
  });

  describe('_Snoc', () => {
    isPrism(Cons._Snoc, SnocArb(jsv.nat), jsv.nearray(jsv.nat), R.equals);
  });

  describe('_head', () => {
    isTraversal(Cons._head);
  });

  describe('_tail', () => {
    isTraversal(Cons._tail);
  });

  describe('_init', () => {
    isTraversal(Cons._init);
  });

  describe('_last', () => {
    isTraversal(Cons._last);
  });

});
