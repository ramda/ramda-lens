var curry = require('ramda/src/curry')
var compose = require('ramda/src/compose')
var traverse = require('ramda/src/traverse')
var map = require('ramda/src/map')
var Identity = require('./internal/_identity')

var _getValue = function(x) { return x.value }

var mapped = curry(function(f, x) {
  return Identity(map(compose(_getValue, f), x))
})

var traversed = function(f) {
  return traverse(this.of, f)
}

module.exports = {
  mapped: mapped,
  traversed: traversed
}
