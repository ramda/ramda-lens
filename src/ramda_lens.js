var _curry1 = require('../node_modules/ramda/src/internal/_curry1')
var _curry2 = require('../node_modules/ramda/src/internal/_curry2')
var _curry3 = require('../node_modules/ramda/src/internal/_curry3')
var compose = require('../node_modules/ramda/src/compose')
var traverse = require('../node_modules/ramda/src/traverse')
var map = require('../node_modules/ramda/src/map')
var Identity = require('./internal/_identity')
var Const = require('./internal/_const')
var view = require('./view')
var over = require('./over')
var set = require('../node_modules/ramda/src/set') // not altered
var monoids = require('./internal/_monoids')

var getValue = function(x) { return x.value; }

var mapped = _curry2(function(f, x) {
  return Identity(map(compose(getValue, f), x));
})

var traversed = _curry3(function(of, f, x) {
  return Identity(traverse(of, compose(getValue, f), x));
})

var foldMap = _curry2(function(f, fldable) {
  return fldable.reduce(function(acc, x) {
    var r = f(x)
    acc = acc || r.empty()
    return acc.concat(r)
  }, null)
})

var folded = _curry2(function(f, x) {
  return compose(Const, foldMap(compose(getValue, f)))(x)
})

var foldMapOf = _curry3(function(l, f, x) {
  return compose(getValue, l(compose(Const, f)))(x)
})

var anyOf = _curry3(function(l, f, xs) {
  return compose(getValue, foldMapOf(l, compose(monoids.Any, f)))(xs)
})

var sumOf = _curry2(function(l, xs) {
  return compose(getValue, foldMapOf(l, monoids.Sum))(xs)
})

var isomorphic = function(f, g) {
  var fun = function(x) { return f(x) }
  fun.from = g;
  return fun;
}

var from = _curry2(function(i, x) {
  return i.from(x)
})

var isos = function(ac, ca, bd, db) {
  return isomorphic(_curry2(function(cfd, a) {
    return map(db, cfd(ac(a)))
  }), _curry2(function(afb, c){
    return map(bd, afb(ca(c)))
  }))
}

var iso = _curry2(function(ab, ba) {
  return isos(ab, ba, ab, ba)
})

var objIpair = iso(function(pairs) {
  return pairs.reduce(function(acc, p) {
    acc[p[0]] = p[1]
    return acc
  }, {})
},
function(o) {
  return Object.keys(o).map(function(k){ return [k, o[k]] })
})


module.exports = {
  mapped: mapped,
  view: view,
  over: over,
  set: set,
  iso: iso,
  from: from,
  objIpair: objIpair,
  traversed: traversed,
  folded: folded,
  foldMapOf: foldMapOf,
  anyOf: anyOf,
  sumOf: sumOf
}
