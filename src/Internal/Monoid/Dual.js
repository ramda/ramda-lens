const _Dual = mType => {
  const Dual = m => ({
    dual: m,
    concat:  other => Dual(other.dual.concat(m))
  });
  Dual.empty = () => Dual(mType.empty());
  return Dual;
};

module.exports = _Dual;
