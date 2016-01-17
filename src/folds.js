var _curry2 = require('../node_modules/ramda/src/internal/_curry2')
var _curry3 = require('../node_modules/ramda/src/internal/_curry3')
var compose = require('../node_modules/ramda/src/compose')
var Const = require('./internal/_const')
var monoids = require('./internal/_monoids')

var _getValue = function(x) { return x.value }

var foldMap = _curry2(function(f, fldable) {
  return fldable.reduce(function(acc, x) {
    var r = f(x)
    acc = acc || r.empty()
    return acc.concat(r)
  }, null)
})

var folded = _curry2(function(f, x) {
  return compose(Const, foldMap(compose(_getValue, f)))(x)
})

var foldMapOf = _curry3(function(l, f, x) {
  return compose(_getValue, l(compose(Const, f)))(x)
})

// Example folds. Needs monoidal types. Ramda fantasy?
var anyOf = _curry3(function(l, f, xs) {
  return compose(_getValue, foldMapOf(l, compose(monoids.Any, f)))(xs)
})

var sumOf = _curry2(function(l, xs) {
  return compose(_getValue, foldMapOf(l, monoids.Sum))(xs)
})

module.exports = {
  folded: folded,
  foldMapOf: foldMapOf,
  anyOf: anyOf,
  sumOf: sumOf
}
