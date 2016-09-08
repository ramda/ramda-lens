var mergeAll = require('ramda/src/mergeAll')

module.exports = mergeAll([
  require('./src/lens'),
  require('./src/folds'),
  require('./src/isos'),
  require('./src/traversals')
])
