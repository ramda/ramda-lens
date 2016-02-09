const
  R = require('ramda'),
  RF = require('ramda-fantasy'),
  Fold = require('./Fold'),
  Lens = require('./Lens'),
  Prism = require('./Prism'),
  Category = require('./Internal/Category'),

  Either = RF.Either,
  Tuple = RF.Tuple;


// _Cons :: Prism [a] [b] (a, [a]) (b, [b])
const _Cons = Prism.prism(
  t => R.prepend(Tuple.fst(t), Tuple.snd(t)),
  R.ifElse(R.isEmpty,
           Either.Left,
           xss => Either.Right(Tuple(R.head(xss), R.tail(xss)))));

// _Snoc :: Prism [a] [b] ([a], a) ([b], b)
const _Snoc = Prism.prism(
  t => R.append(Tuple.snd(t), Tuple.fst(t)),
  R.ifElse(R.isEmpty,
           Either.Left,
           xss => Either.Right(Tuple(R.init(xss), R.last(xss)))));

// cons :: a -> [a] -> [a]
const cons = R.curry((x, xs) =>
  Prism.review(_Cons, Tuple(x, xs)));

// uncons :: [a] -> Maybe (Tuple a [a])
const uncons = Fold.preview(_Cons);

// snoc :: [a] -> a -> [a]
const snoc = R.curry((xs, x) =>
  Prism.review(_Snoc, Tuple(xs, x)));

// unsnoc :: [a] -> Maybe (Tuple [a] a)
const unsnoc = Fold.preview(_Snoc);

// _head :: TraversalP s a
const _head = Category.compose(_Cons, Lens._1);

// _tail :: TraversalP s s
const _tail = Category.compose(_Cons, Lens._2);

// _init :: TraversalP s a
const _init = Category.compose(_Snoc, Lens._1);

// _last :: TraversalP s s
const _last = Category.compose(_Snoc, Lens._2);

module.exports = {
  _Cons,
  _Snoc,
  cons,
  uncons,
  snoc,
  unsnoc,
  _head,
  _tail,
  _init,
  _last
};
