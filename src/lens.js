var set = require('../node_modules/ramda/src/set')
var lens = require('../node_modules/ramda/src/lens')

module.exports = {
  lens: lens,
  set: set,
  view: require('./view'),
  over: require('./over')
}
