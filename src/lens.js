var set = require('ramda/src/set')
var lens = require('ramda/src/lens')
var curry = require('ramda/src/curry')
var view = require('ramda/src/view')
var pipe = require('ramda/src/pipe')
var equals = require('ramda/src/equals')
var defaultTo = require('ramda/src/defaultTo')

var lensEq = curry(function(_lens, val, obj) {
  return pipe(view(_lens), equals(val))(obj)
});

var lensSatisfies = curry(function(pred, _lens, obj) {
  return pipe(view(_lens), pred, equals(true))(obj)
});

var viewOr = curry(function (defaultValue, _lens, obj) {
  return pipe(view(_lens), defaultTo(defaultValue))(obj)
});

module.exports = {
  lens: lens,
  set: set,
  view: require('./view'),
  viewOr: viewOr,
  over: require('./over'),
  lensEq: lensEq,
  lensSatisfies: lensSatisfies
}
