const
  RF = require('ramda-fantasy');

const First = m => ({
  first:  m,
  concat: other => m.isJust ? First(m) : other
});

First.empty = () => First(RF.Maybe.Nothing());

module.exports = First;
