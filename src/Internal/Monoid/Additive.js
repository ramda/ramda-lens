const Additive = n => ({
  toNum: n,
  concat: other => Additive(n + other.toNum)
});

Additive.empty = () => Additive(0);

module.exports = Additive;
