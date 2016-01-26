const
  jsv     = require('jsverify'),
  R       = require('ramda'),
  RF      = require('ramda-fantasy'),
  Fold    = require('../src/Fold'),
  Prism   = require('../src/Prism'),
  isPrism = require('../laws/Prism'),

  UnitArb = jsv.constant({}),

  intStringArb = jsv.nat.smap(n => n.toString(), s => parseInt(s, 10)),
  alphaOnlyArb = jsv.string.smap(R.replace(/[^a-zA-Z]/g, ''), s => s),

  LeftArb   = arb => arb.smap(RF.Either.Left, e => e.value),
  RightArb  = arb => arb.smap(RF.Either.Right, e => e.value),

  JustArb    = arb => arb.smap(RF.Maybe.Just, m => m.value),
  NothingArb = jsv.constant(RF.Maybe.Nothing());


describe('Prism', () => {

  describe('prism', () => {
    //:: PrismP String Int
    const parseIntP = Prism.prism(x => x.toString(), s => {
      const i = parseInt(s, 10);
      return isNaN(i) ? RF.Either.Left(s) : RF.Either.Right(i);
    });

    isPrism(parseIntP, jsv.integer, intStringArb, R.equals);

    jsv.property('preview int string', jsv.integer, n =>
      RF.Maybe.maybe(false, R.equals(n), Fold.preview(parseIntP, n.toString())));

    jsv.property('preview alpha string', alphaOnlyArb, s =>
      RF.Maybe.maybe(true, R.F, Fold.preview(parseIntP, s)));

    jsv.property('composition prism',
                 LeftArb(RightArb(jsv.nat)),
                 e => R.equals(Fold.preview(R.compose(Prism._Left, Prism._Right), e),
                               RF.Maybe.Just(e.value.value)));
  });

  describe('prism_', () => {
    //:: PrismP String Int
    const parseIntP = Prism.prism_(x => x.toString(), s => {
      const i = parseInt(s, 10);
      return isNaN(i) ? RF.Maybe.Nothing() : RF.Maybe.Just(i);
    });

    isPrism(parseIntP, jsv.integer, intStringArb, R.equals);

    jsv.property('preview int string', jsv.integer, n =>
      RF.Maybe.maybe(false, R.equals(n), Fold.preview(parseIntP, n.toString())));

    jsv.property('preview alpha string', alphaOnlyArb, s =>
      RF.Maybe.maybe(true, R.F, Fold.preview(parseIntP, s)));
  });

  describe('review', () => {
    //:: PrismP String Int
    const parseIntP = Prism.prism_(x => x.toString(), s => {
      const i = parseInt(s, 10);
      return isNaN(i) ? RF.Maybe.Nothing() : RF.Maybe.Just(i);
    });

    jsv.property('int to string',
                 jsv.integer,
                 n => Prism.review(parseIntP, n) === n.toString(10));
  });

  describe('_Left', () => {
    isPrism(Prism._Left, jsv.nat, LeftArb(jsv.nat), R.equals);
  });

  describe('_Right', () => {
    isPrism(Prism._Right, jsv.nat, RightArb(jsv.nat), R.equals);
  });

  describe('_Just', () => {
    isPrism(Prism._Just, jsv.nat, JustArb(jsv.nat), R.equals);
  });

  describe('_Nothing', () => {
    isPrism(Prism._Nothing, UnitArb, NothingArb, R.equals);
  });

  describe('nearly', () => {
    isPrism(Prism.nearly([], R.isEmpty), UnitArb, jsv.constant([]), R.equals);
  });

  describe('only', () => {
    const n = jsv.sampler(jsv.nat)();
    isPrism(Prism.only(n), UnitArb, jsv.constant(n), R.equals);
  });

});
