var _curry2 = require('../node_modules/ramda/src/internal/_curry2')
var map = require('../node_modules/ramda/src/map')

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


// Helpful Isos:
// ================
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
  iso: iso,
  from: from,
  objIpair: objIpair
}
