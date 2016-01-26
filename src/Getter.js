const
  Fold  = require('./Fold'),
  UnitM = require('./Internal/Monoid/Unit');


//:: Getter s t a b -> s -> a
const view = Fold.foldOf(UnitM);

module.exports = {
  view
};
