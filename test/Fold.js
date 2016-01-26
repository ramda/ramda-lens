const
  R         = require('ramda'),
  RF        = require('ramda-fantasy'),
  jsv       = require('jsverify'),
  Fold      = require('../src/Fold'),
  Lens      = require('../src/Lens'),
  Prism     = require('../src/Prism'),
  Traversal = require('../src/Traversal'),
  Additive  = require('../src/Internal/Monoid/Additive'),

  JustArb = arb => arb.smap(RF.Maybe.Just, m => m.value),
  MaybeArb = arb => jsv.oneof(jsv.constant(RF.Maybe.Nothing()),
                              JustArb(arb));


describe('Fold', () => {

  describe('foldMapOf', () => {
    jsv.property('foldMapOf',
                 jsv.array(jsv.nat),
                 xs => R.equals(R.sum(xs),
                                Fold.foldMapOf(Additive, Traversal.traversed, Additive, xs).toNum));
  });

  describe('foldOf', () => {
    jsv.property('foldOf',
                 jsv.array(jsv.nat),
                 xs => R.equals(R.sum(xs),
                                Fold.foldOf(Additive, Traversal.traversed, R.map(Additive, xs)).toNum));
  });

  describe('preview', () => {
    jsv.property('preview empty traversal',
                 () => R.equals(Fold.preview(Traversal.traversed, []), RF.Maybe.Nothing()));

    jsv.property('preview non-empty traversal',
                 jsv.json, jsv.array(jsv.json),
                 (x, xs) => R.equals(Fold.preview(Traversal.traversed, R.prepend(x, xs)), RF.Maybe.Just(x)));

    jsv.property('preview empty prism',
                 jsv.json,
                 a => R.equals(Fold.preview(Prism._Right, RF.Either.Left(a)), RF.Maybe.Nothing()));

    jsv.property('preview non-empty prism',
                 jsv.json,
                 a => R.equals(Fold.preview(Prism._Right, RF.Either.Right(a)), RF.Maybe.Just(a)));
  });

  describe('foldrOf', () => {
    jsv.property('foldrOf',
                 jsv.array(jsv.nat),
                 xs => R.equals(Fold.foldrOf(Traversal.traversed, R.prepend, [], xs), xs));
  });

  describe('foldlOf', () => {
    jsv.property('foldlOf',
                 jsv.array(jsv.nat),
                 xs => R.equals(Fold.foldrOf(Traversal.traversed, R.add, 0, xs), R.sum(xs)));
  });

  describe('andOf', () => {
    jsv.property('andOf',
                 jsv.array(jsv.bool),
                 xs => R.equals(Fold.andOf(Traversal.traversed, xs), R.reduce(R.and, true, xs)));
  });

  describe('orOf', () => {
    jsv.property('orOf',
                 jsv.array(jsv.bool),
                 xs => R.equals(Fold.orOf(Traversal.traversed, xs), R.reduce(R.or, false, xs)));
  });

  describe('elemOf', () => {
    jsv.property('elemOf',
                 jsv.json, jsv.array(jsv.json),
                 (x, xs) => R.equals(Fold.elemOf(Traversal.traversed, x, xs), R.contains(x, xs)));

    jsv.property('elemOf does exist',
                 jsv.nearray(jsv.json),
                 xs => Fold.elemOf(Traversal.traversed, xs[0], xs));
  });

  describe('notElemOf', () => {
    jsv.property('notElemOf',
                 jsv.json, jsv.array(jsv.json),
                 (x, xs) => R.equals(Fold.notElemOf(Traversal.traversed, x, xs), !R.contains(x, xs)));

    jsv.property('notElemOf does not exist',
                 jsv.json, jsv.nearray(jsv.json),
                 (x, xs) => Fold.notElemOf(Traversal.traversed, x, R.without([x], xs)));
  });

  describe('sumOf', () => {
    jsv.property('sumOf',
                 jsv.array(jsv.nat),
                 xs => R.equals(Fold.sumOf(Traversal.traversed, xs), R.sum(xs)));
  });

  describe('productOf', () => {
    jsv.property('productOf',
                 jsv.array(jsv.nat),
                 xs => R.equals(Fold.productOf(Traversal.traversed, xs), R.product(xs)));
  });

  describe('lengthOf', () => {
    jsv.property('lengthOf',
                 jsv.array(jsv.nat),
                 xs => R.equals(Fold.lengthOf(Traversal.traversed, xs), R.length(xs)));
  });

  describe('firstOf', () => {
    jsv.property('firstOf empty',
                 () => R.equals(Fold.firstOf(Traversal.traversed, []), RF.Maybe.Nothing()));

    jsv.property('firstOf non-empty',
                 jsv.nearray(jsv.nat),
                 xs => R.equals(Fold.firstOf(Traversal.traversed, xs), RF.Maybe.Just(R.head(xs))));
  });

  describe('lastOf', () => {
    jsv.property('lastOf empty',
                 () => R.equals(Fold.lastOf(Traversal.traversed, []), RF.Maybe.Nothing()));

    jsv.property('lastOf non-empty',
      jsv.nearray(jsv.nat),
      xs => R.equals(Fold.lastOf(Traversal.traversed, xs), RF.Maybe.Just(R.last(xs))));
  });

  describe('maximumOf', () => {
    jsv.property('maximumOf empty',
      () => R.equals(Fold.maximumOf(Traversal.traversed, []), RF.Maybe.Nothing()));

    jsv.property('maximumOf non-empty',
      jsv.nearray(jsv.nat),
      xs => R.equals(Fold.maximumOf(Traversal.traversed, xs), RF.Maybe.Just(R.reduce(R.max, -Infinity, xs))));
  });

  describe('minimumOf', () => {
    jsv.property('minimumOf empty',
      () => R.equals(Fold.minimumOf(Traversal.traversed, []), RF.Maybe.Nothing()));

    jsv.property('minimumOf non-empty',
      jsv.nearray(jsv.nat),
      xs => R.equals(Fold.minimumOf(Traversal.traversed, xs), RF.Maybe.Just(R.reduce(R.min, Infinity, xs))));
  });

  describe('findOf', () => {
    jsv.property('findOf',
                 jsv.fn(jsv.bool), jsv.array(jsv.json),
                 (fn, xs) => R.equals(Fold.findOf(Traversal.traversed, fn, xs), RF.Maybe(R.find(fn, xs))));
  });

  describe('sequenceOf_', () => {
    jsv.property('sequenceOf_ all Just',
                 jsv.array(JustArb(jsv.json)),
                 xs => R.equals(Fold.sequenceOf_(RF.Maybe, Traversal.traversed, xs),
                                RF.Maybe.Just({})));

    jsv.property('sequenceOf_ with Nothing',
                 jsv.array(MaybeArb(jsv.json)),
                 xs => R.equals(Fold.sequenceOf_(RF.Maybe, Traversal.traversed, R.prepend(RF.Maybe.Nothing(), xs)),
                                RF.Maybe.Nothing()));
  });

  describe('toListOf', () => {
    jsv.property('toListOf list',
                 jsv.array(jsv.json),
                 xs => R.equals(Fold.toListOf(Traversal.traversed, xs), xs));

    jsv.property('toListOf Just',
                 jsv.json,
                 a => R.equals(Fold.toListOf(Prism._Just, RF.Maybe.Just(a)), [a]));

    jsv.property('toListOf Nothing',
                 () => R.equals(Fold.toListOf(Prism._Just, RF.Maybe.Nothing()), []));
  });

  describe('has', () => {
    jsv.property('has empty traversal',
                 () => !Fold.has(Traversal.traversed, []));

    jsv.property('has non-empty traversal',
                 jsv.nearray(jsv.json),
                 xs => Fold.has(Traversal.traversed, xs));

    jsv.property('has empty prism',
                 () => !Fold.has(Prism._Just, RF.Maybe.Nothing()));

    jsv.property('has non-empty prism',
                 jsv.json,
                 a => Fold.has(Prism._Just, RF.Maybe.Just(a)));
  });

  describe('hasnt', () => {
    jsv.property('hasnt empty traversal',
                 () => Fold.hasnt(Traversal.traversed, []));

    jsv.property('hasnt non-empty traversal',
                 jsv.nearray(jsv.json),
                 xs => !Fold.hasnt(Traversal.traversed, xs));

    jsv.property('hasnt empty prism',
                 () => Fold.hasnt(Prism._Just, RF.Maybe.Nothing()));

    jsv.property('hasnt non-empty prism',
                 jsv.json,
                 a => !Fold.hasnt(Prism._Just, RF.Maybe.Just(a)));
  });

  describe('filtered', () => {
    jsv.property('filtered',
                 jsv.array(jsv.json), jsv.fn(jsv.bool),
                 (xs, fn) => R.equals(Fold.toListOf(R.compose(Traversal.traversed, Fold.filtered(fn)), xs),
                                      R.filter(fn, xs)));
  });

});
