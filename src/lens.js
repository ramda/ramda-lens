var set = require('ramda/src/set')
var lens = require('ramda/src/lens')


module.exports = {
  lens: lens,
  set: set,
  view: require('./view'),
  over: require('./over')
}
