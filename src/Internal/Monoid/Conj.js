const Conj = b => ({
  toBool: b,
  concat: other => Conj(b && other.toBool)
});

Conj.empty = () => Conj(true);

module.exports = Conj;
