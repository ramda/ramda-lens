var R = require('ramda');

module.exports = R.mergeAll([
  require('./src/Cons'),
  require('./src/Fold'),
  require('./src/Getter'),
  require('./src/Iso'),
  require('./src/Lens'),
  require('./src/Prism'),
  require('./src/Setter'),
  require('./src/Traversal')
]);
