const R = require('ramda');


// _Const :: Monoid m => Type m -> a -> Const a b
const _Const = M => {
  function Const(x) {
    return {
      getConst: x,
      map:      _ => Const(x),
      ap:       other => Const(R.concat(x, other.getConst)),
      chain:    _ => Const(x)
    }
  }

  Const.empty = Const(M.empty());

  Const.of = _ => Const(M.empty());

  return Const;
};

module.exports = _Const;
