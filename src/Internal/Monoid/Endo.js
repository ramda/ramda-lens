const Endo = f => ({
  runEndo: f,
  concat: g => Endo(x => f(g.runEndo(x)))
});

Endo.empty = () => Endo(x => x);

module.exports = Endo;
