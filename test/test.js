const assert = require("assert")
const L = require('../index')
const R = require("ramda")
const compose = R.compose
const lensProp = R.lensProp
const lensIndex = R.lensIndex
const set = L.set
const view = L.view
const over = L.over
const mapped = L.mapped
const traversed = L.traversed
const from = L.from
const objIpair = L.objIpair
const foldMapOf = L.foldMapOf
const anyOf = L.anyOf
const sumOf = L.sumOf
const listOf = L.listOf

const Identity = require('../src/internal/_identity')
const monoids = require('../src/internal/_monoids')
const Sum = monoids.Sum

describe("Lenses", function() {
  const users = [
    { id: 1, name: 'Ivan', addresses: [{street: '92 Oak St.', zip: '08081'}] },
    { id: 2, name: 'Donielle', addresses: [{street: '393 Post Ave.', zip: '93011'}] },
    { id: 3, name: 'Rick', addresses: [] }
  ]

  const _0 = lensIndex(0)
  const name = lensProp('name')
  const addresses = lensProp('addresses')
  const street = lensProp('street')
  const zip = lensProp('zip')


  describe("Set/View/Over", function() {
    const firstStreet = compose(_0, addresses, _0, street)

    it('gets the value', function() {
      const result = view(firstStreet, users)
      assert.equal('92 Oak St.', result)
    })

    it('sets the value without altering the rest', function() {
      const res = set(firstStreet, '88 Willow Dr.', users)
      assert.equal('88 Willow Dr.', res[0].addresses[0].street)
      assert.equal('393 Post Ave.', res[1].addresses[0].street)
      assert.equal('92 Oak St.', users[0].addresses[0].street)
    })

    it('runs functions over the value', function() {
      const res = over(firstStreet, R.toUpper, users)
      assert.equal('92 OAK ST.', res[0].addresses[0].street)
      assert.equal('393 Post Ave.', res[1].addresses[0].street)
      assert.equal('92 Oak St.', users[0].addresses[0].street)
    })
  })

  describe("Mapping", function() {
    const zips = compose(mapped, addresses, mapped, zip)

    it('alters a mapped value', function() {
      const res = over(zips, R.reverse, users)
      assert.equal('11039', res[1].addresses[0].zip)
      assert.equal('18080', res[0].addresses[0].zip)
      assert.equal('08081', users[0].addresses[0].zip)
    })

    it('sets a mapped value', function() {
      const res = set(zips, '11111', users)
      assert.equal('11111', res[1].addresses[0].zip)
      assert.equal('11111', res[0].addresses[0].zip)
      assert.equal('08081', users[0].addresses[0].zip)
    })
  })

  describe("Traversing", function() {
    const trav_fn = function(x) { return x+1 }

    it('over a traversable', function() {
      const result = over(traversed, trav_fn, Identity(2))
      const expected = Identity(3)
      assert.deepEqual(result.value, expected.value)
    })

    it('traversals compose', function() {
      const result = over(compose(mapped, traversed), trav_fn, [Identity(2), Identity(3)])
      const expected = [Identity(3), Identity(4)]
      // assert(result == expected) fails so:
      assert.deepEqual(result[0].value, expected[0].value)
      assert.deepEqual(result[1].value, expected[1].value)
    })
  })

  describe("Isomorphism", function() {
    const handles = {brian: 'drboolean', joe: 'begriffs'}
    const ps = [['fight', 'club'], ['barber', 'shop']]

    it('views an iso', function() {
      const res = view(objIpair, ps)
      assert.deepEqual({fight: 'club', barber: 'shop'}, res)
    })

    it('runs over an iso', function() {
      const res = over(objIpair, R.merge({animal: 'crackers'}), ps)
      const exp = [['animal', 'crackers'], ['fight', 'club'], ['barber', 'shop']]
      assert.deepEqual(exp, res)
    })

    it('views an iso (from)', function() {
      const res = view(from(objIpair), handles)
      assert.deepEqual([['brian', 'drboolean'], ['joe', 'begriffs']], res)
    })

    it('runs fns over an iso (from)', function() {
      const res = over(from(objIpair), R.map(R.reverse), handles)
      assert.deepEqual({drboolean: 'brian', begriffs: 'joe'}, res)
    })

    it('composes nicely', function() {
      const l = compose(from(objIpair), _0, lensIndex(1))
      const res = over(l, R.toUpper, handles)
      assert.deepEqual({brian: 'DRBOOLEAN', joe: 'begriffs'}, res)
    })
  })

  describe("Folds", function() {

    it('foldMapOf(traversed) == foldMap', function() {
      var foldMap = foldMapOf(traversed)
      var res = foldMap(Sum.empty(), Sum, [1,2,3])
      assert.equal(res.value, 6)
    })

    it('works with sumOf', function() {
      var sum = sumOf(traversed)
      var res = sum([1,2,3])
      assert.equal(res, 6)
    })

    it('works with anyOf', function() {
      var any = anyOf(traversed)
      var res = any(function(x){ return x > 4 }, [1,2,3])
      assert.equal(res, false)
    })

    it('works with listOf', function() {
      var unnest = listOf(compose(traversed, lensProp('x'), traversed))
      var res = unnest([{ x: [1, 2] }, { x: [3, 4] }, { x: [5, 6] }])
      assert.deepEqual(res, [1, 2, 3, 4, 5, 6])
    })

    it('works with an empty list', function() {
      var res = foldMapOf(traversed, Sum.empty(), Sum, [])
      assert.equal(res.value, 0)
    });
  })
})

