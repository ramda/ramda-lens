var _curry2 = require('../node_modules/ramda/src/internal/_curry2')
var _curry3 = require('../node_modules/ramda/src/internal/_curry3')

var compose = require('../node_modules/ramda/src/compose')
var traverse = require('../node_modules/ramda/src/traverse')
var map = require('../node_modules/ramda/src/map')
var Identity = require('./internal/_identity')

var _getValue = function(x) { return x.value; }

var mapped = _curry2(function(f, x) {
  return Identity(map(compose(_getValue, f), x));
})
var traversed = _curry3(function(of, f, x) {
  return Identity(traverse(of, compose(_getValue, f), x));
})

module.exports = {
  mapped: mapped,
  traversed: traversed
}
