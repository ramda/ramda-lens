module.exports = function Identity(x) {
  return {
    type: 'Identity',
    value: x,
    map: function(f) { return Identity(f(x)) },
    ap: function(other) { return other.map(x) },
    sequence: function(of) {
      return x.map(Identity)
    }
  }
}
