var equals = require('ramda/src/equals');

function Identity(x) {
  return {
    type: 'Identity',
    value: x,
    map: function(f) { return Identity(f(x)) },
    ap: function(other) { return other.map(x) },
    sequence: function(of) {
      return x.map(Identity)
    },
    equals: function(other) {
      return other.type == 'Identity' && equals(x, other.value)
    }
  }
}

Identity.of = Identity

module.exports = Identity
