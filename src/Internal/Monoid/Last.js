const
  RF = require('ramda-fantasy');


const Last = m => ({
  last: m,
  concat: other => {
    return other.last.isJust ? other : Last(m);
  }
});

Last.empty = () => Last(RF.Maybe.Nothing());

module.exports = Last;
