const
  jsv    = require('jsverify'),
  R      = require('ramda'),
  RF     = require('ramda-fantasy'),
  Getter = require('../src/Getter'),
  Lens   = require('../src/Lens'),
  isLens = require('../laws/Lens'),

  TupleArb = (arb1, arb2) =>
    jsv.pair(arb1, arb2).smap(pair => RF.Tuple(pair[0], pair[1]),
                              t => [RF.Tuple.fst(t), RF.Tuple.snd(t)]),

  MaybeArb = arb =>
    jsv.oneof(arb.smap(RF.Maybe.Just, m => m.value),
              jsv.constant(RF.Maybe.Nothing())),

  recordWithKeyArb = (key, arb) =>
    jsv.pair(arb, jsv.dict).smap(pair => R.assoc(key, pair[0], pair[1]), R.identity),

  objMaybeKeyArb = (key, arb) =>
    jsv.oneof(jsv.dict, recordWithKeyArb(key, arb));


describe('Lens', () => {

  describe('lens_', () => {
    const k = jsv.sampler(jsv.asciistring)();
    const l = Lens.lens_(s => RF.Tuple(s[k], a => R.assoc(k, a, s)));

    isLens(l, recordWithKeyArb(k, jsv.json), jsv.json, R.equals, R.equals);

    jsv.property('composition',
                 recordWithKeyArb(k, TupleArb(jsv.nat, jsv.nat)),
                 obj => R.equals(Getter.view(R.compose(l, Lens._1), obj),
                                 RF.Tuple.fst(obj[k])));
  });

  describe('lens', () => {
    const k = jsv.sampler(jsv.asciistring)();
    const l = Lens.lens(R.prop(k), R.flip(R.assoc(k)));

    isLens(l, recordWithKeyArb(k, jsv.json), jsv.json, R.equals, R.equals);

    jsv.property('composition',
                 recordWithKeyArb(k, TupleArb(jsv.nat, jsv.nat)),
                 obj => R.equals(Getter.view(R.compose(l, Lens._1), obj),
                                 RF.Tuple.fst(obj[k])));
  });

  describe('_1', () => {
    isLens(Lens._1, TupleArb(jsv.nat, jsv.string), jsv.nat, R.equals, R.equals);
  });

  describe('_2', () => {
    isLens(Lens._2, TupleArb(jsv.string, jsv.nat), jsv.nat, R.equals, R.equals);
  });

  describe('atObject', () => {
    const k = jsv.sampler(jsv.asciistring)();
    isLens(Lens.atObject(k), objMaybeKeyArb(k, jsv.nat), MaybeArb(jsv.nat), R.equals, R.equals);
  });

});
