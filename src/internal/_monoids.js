function Sum(x) {
  return {
    type: 'Sum',
    value: x,
    concat: function(s){ return Sum(x + s.value) },
    empty: function() {return Sum(0) }
  }
}

function Any(x) {
  return {
    type: 'Any',
    value: x,
    concat: function(s){ return Any(x || s.value) },
    empty: function() {return Any(false) }
  }
}

module.exports = {Sum: Sum, Any: Any}
