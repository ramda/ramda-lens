//:: Category a => Type a -> a b b
const id = Category =>
  Category === Function ? (x => x) : Category.id;

//:: Semigroupoid a => a c d -> a b c -> a b d
const compose = (f, g) => {
  if (typeof f.compose === 'function') return f.compose(g);
  if (typeof f === 'function' && typeof g === 'function') return x => f(g(x));
  throw new TypeError('Expected Semigroupoid');
};

//:: Semigroupoid a => a b c -> a c d -> a b d
const pipe = (f, g) => compose(g, f);

module.exports = {
  id,
  compose,
  pipe
};
