const
  Profunctor = require('./Class/Profunctor');


//:: Profunctor p => (p b a -> p t s) -> Re p s t a b
const Re = r => ({
  runRe: r,
  dimap: (f, g) => Re(p => r(Profunctor.dimap(g, f, p)))
});

module.exports = Re;
