var curry = require('ramda/src/curry')
var map = require('ramda/src/map')

var isomorphic = function(f, g) {
  var fun = function(x) { return f(x) }
  fun.from = g;
  return fun;
}

var from = curry(function(i, x) {
  return i.from(x)
})

var isos = function(ac, ca, bd, db) {
  return isomorphic(curry(function(cfd, a) {
    return map(db, cfd(ac(a)))
  }), curry(function(afb, c){
    return map(bd, afb(ca(c)))
  }))
}

var iso = curry(function(ab, ba) {
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
