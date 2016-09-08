var curry = require('ramda/src/curry')
var compose = require('ramda/src/compose')
var _Const = require('./internal/_const')
var monoids = require('./internal/_monoids')

var _getValue = function(x) { return x.value }


var foldMapOf = curry(function(l, empty, toM, x) {
  var Const = _Const(empty)
  return _getValue(l.call(Const, function(a) {
    return Const(toM(a))
  })(x))
})

// Example folds. Needs monoidal types. Ramda fantasy?
var anyOf = curry(function(l, f, xs) {
  return compose(_getValue, foldMapOf(l, monoids.Any.empty(), compose(monoids.Any, f)))(xs)
})

var sumOf = curry(function(l, xs) {
  return compose(_getValue, foldMapOf(l, monoids.Sum.empty(), monoids.Sum))(xs)
})

module.exports = {
  foldMapOf: foldMapOf,
  anyOf: anyOf,
  sumOf: sumOf
}
