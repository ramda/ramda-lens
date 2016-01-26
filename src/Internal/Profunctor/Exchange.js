//:: (s -> a) -> (b -> t) -> Exchange a b s t
const Exchange = (s2a, b2t) => ({
  runTo: s2a,
  runFro: b2t,
  dimap: (f, g) => Exchange(s => s2a(f(s)), b => g(b2t(b)))
});

module.exports = Exchange;
