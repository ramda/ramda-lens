const Unit = b => ({
  concat: _ => _unitM
});

const _unitM = Unit({});

Unit.empty = () => _unitM;

module.exports = Unit;
