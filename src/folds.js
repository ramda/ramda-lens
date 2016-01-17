var R = require('ramda')
var curry = R.curry
var compose = R.compose
var Const = require('./internal/_const')
var monoids = require('./internal/_monoids')

var _getValue = function(x) { return x.value }

var foldMap = curry(function(f, fldable) {
  return fldable.reduce(function(acc, x) {
    var r = f(x)
    acc = acc || r.empty()
    return acc.concat(r)
  }, null)
})

var folded = curry(function(f, x) {
  return compose(Const, foldMap(compose(_getValue, f)))(x)
})

var foldMapOf = curry(function(l, f, x) {
  return compose(_getValue, l(compose(Const, f)))(x)
})

// Example folds. Needs monoidal types. Ramda fantasy?
var anyOf = curry(function(l, f, xs) {
  return compose(_getValue, foldMapOf(l, compose(monoids.Any, f)))(xs)
})

var sumOf = curry(function(l, xs) {
  return compose(_getValue, foldMapOf(l, monoids.Sum))(xs)
})

module.exports = {
  folded: folded,
  foldMapOf: foldMapOf,
  anyOf: anyOf,
  sumOf: sumOf
}
