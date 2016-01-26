const Multiplicative = n => ({
  toNum: n,
  concat: other => Multiplicative(n * other.toNum)
});
Multiplicative.empty = () => Multiplicative(1);

module.exports = Multiplicative;
