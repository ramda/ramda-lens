module.exports = function _Const(empty) {
  function Const(x) {
    return {
      type:  'Const',
      value: x,
      map:   function (f) {
        return this
      },
      ap:    function (other) {
        return Const(x.concat(other.value))
      }
    }
  }
  Const.of = function(_) {
    return Const(empty)
  }
  return Const
}
