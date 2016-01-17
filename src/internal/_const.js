module.exports = function Const(x) {
  return {
    type: 'Const',
    value: x,
    map: function(f) { return this },
    ap: function(other) { return Const(x.concat(other.value)) }
  }
}

