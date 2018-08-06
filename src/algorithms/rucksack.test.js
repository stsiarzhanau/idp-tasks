import getBestSet, { getPowerSet, getSetWeight, getSetPrice } from './rucksack'

const in1 = [0, 1, 2]
const out1 = [[], [0], [1], [0, 1], [2], [0, 2], [1, 2], [0, 1, 2]]

const items = [
  { name: 'beer', weight: 0.5, price: 2 },
  { name: 'cola', weight: 1, price: 1.5 },
  { name: 'appleJuice', weight: 2, price: 2 },
  { name: 'pinappleJuice', weight: 2, price: 3 },
  { name: 'orangeJuice', weight: 1.5, price: 3 },
  { name: 'schweppes', weight: 0.9, price: 1.6 },
]

const totalWeight = 7.9
const totalPrice = 13.1

const maxWeight = 5

const bestSet = [
  {
    name: 'beer',
    price: 2,
    weight: 0.5,
  },
  {
    name: 'pinappleJuice',
    price: 3,
    weight: 2,
  },
  {
    name: 'orangeJuice',
    price: 3,
    weight: 1.5,
  },
  {
    name: 'schweppes',
    price: 1.6,
    weight: 0.9,
  },
]

describe('#getPowerSet()', () => {
  it('makes power set from the set of the items', () => {
    expect(getPowerSet(in1)).to.deep.equal(out1)
    expect(getPowerSet(items).length).to.equal(2 ** items.length)
  })
})

describe('#getSetWeight()', () => {
  it('correctly calculates weight of the set of the items', () => {
    expect(getSetWeight(items)).to.equal(totalWeight)
  })
})

describe('#getSetPrice()', () => {
  it('correctly calculates price of the set of the items', () => {
    expect(getSetPrice(items)).to.equal(totalPrice)
  })
})


describe('сustom event system', () => {
  it('runs registered callback when event is emitted ', () => {
    expect(getBestSet(items, maxWeight)).to.deep.equal(bestSet)
  })
})
