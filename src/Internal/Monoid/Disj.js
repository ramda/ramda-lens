const Disj = b => ({
  toBool: b,
  concat: other => Disj(b || other.toBool)
});
Disj.empty = () => Disj(false);

module.exports = Disj;
