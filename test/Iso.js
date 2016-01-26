const
  R         = require('ramda'),
  RF        = require('ramda-fantasy'),
  jsv       = require('jsverify'),
  Getter    = require('../src/Getter'),
  Setter    = require('../src/Setter'),
  Iso       = require('../src/Iso'),
  Lens      = require('../src/Lens'),
  Prism     = require('../src/Prism'),
  Traversal = require('../src/Traversal'),
  isIso     = require('../laws/Iso'),

  ObjMaybeKeyArb = (key, arb) =>
    jsv.oneof(jsv.dict,
              jsv.pair(arb, jsv.dict).smap(pair => R.assoc(key, pair[0], pair[1]),
                                           R.identity)),

  strToCharList  = s => R.map(R.identity, s),
  charListToStr  = R.join(''),
  strCharListIso = Iso.iso(strToCharList, charListToStr),

  charToInt    = c => c.charCodeAt(0),
  intToChar    = i => String.fromCharCode(i),
  charToIntIso = Iso.iso(charToInt, intToChar);


describe('Iso', () => {

  describe('iso', () => {
    isIso(strCharListIso, jsv.asciistring, jsv.array(jsv.asciichar), R.equals, R.equals);

    jsv.property('composition',
                 jsv.asciistring,
                 s => {
                   const i = R.compose(strCharListIso, Traversal.traversed, charToIntIso);
                   return R.equals(Setter.over(i, R.inc, s),
                     R.join('', R.map(R.compose(intToChar, R.inc, charToInt), s)))
                 });
  });

  describe('re', () => {
    isIso(Iso.re(strCharListIso), jsv.array(jsv.asciichar), jsv.asciistring, R.equals, R.equals);
  });

  describe('withIso', () => {
    jsv.property('withIso',
                 jsv.asciistring, jsv.array(jsv.asciichar),
                 (s, cs) => Iso.withIso(strCharListIso, (to, fro) =>
                   R.equals(strToCharList(s), to(s)) && R.equals(charListToStr(cs), fro(cs))));
  });

  describe('under', () => {
    jsv.property('under',
                 jsv.array(jsv.asciichar),
                 cs => R.equals(Iso.under(strCharListIso, R.toUpper, cs),
                                R.map(R.toUpper, cs)));
  });

  describe('non', () => {
    const k = jsv.sampler(jsv.asciistring)();
    jsv.property('non',
                 ObjMaybeKeyArb(k, jsv.nat),
                 obj => R.equals(Getter.view(R.compose(Lens.atObject(k), Iso.non(0)), obj),
                                 obj.hasOwnProperty(k) ? obj[k] : 0));
  });

  describe('non_', () => {
    const k = jsv.sampler(jsv.asciistring)();
    jsv.property('non_',
                 ObjMaybeKeyArb(k, jsv.nat),
                 obj => R.equals(Getter.view(R.compose(Lens.atObject(k), Iso.non_(Prism.only(0))), obj),
                                 obj.hasOwnProperty(k) ? obj[k] : 0));
  });

});
