var R = require('ramda')
var set = R.set
var lens = R.lens


module.exports = {
  lens: lens,
  set: set,
  view: require('./view'),
  over: require('./over')
}
