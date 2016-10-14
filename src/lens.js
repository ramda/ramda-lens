var ConstList = require('./internal/_const')([])
var Identity  = require('./internal/_identity')
var curry     = require('ramda/src/curry')
var lens      = require('ramda/src/lens')

var view = curry(function view(lens, x) {
  return lens.call(ConstList, function(a) {
    return ConstList([a])
  })(x).value[0]
})

var over = curry(function over(lens, f, x) {
  return lens.call(Identity, function(y) {
    return Identity(f(y));
  })(x).value;
})

var set = curry(function set(lens, v, x) {
  return lens.call(Identity, function(_) {
    return Identity(v);
  })(x).value;
})

module.exports = {
  lens: lens,
  set: set,
  view: view,
  over: over
}
