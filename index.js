var R = require('ramda')

module.exports = R.mergeAll([
  require('./src/lens'),
  require('./src/folds'),
  require('./src/isos'),
  require('./src/traversals')
])
