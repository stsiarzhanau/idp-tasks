export const getPowerSet = (items) => {
  let powerSet = [[]]
  items.forEach((item) => {
    const powerSetCopy = [...powerSet]
    powerSet = [...powerSet, ...powerSetCopy.map(subset => [...subset, item])]
  })
  return powerSet
}

export const getSetWeight = set => set.reduce((acc, { weight = 0 }) => {
  acc += weight
  return acc
}, 0)

export const getSetPrice = set => set.reduce((acc, { price = 0 }) => {
  acc += price
  return acc
}, 0)

const getBestSet = (items, maxWeight) => {
  const powerSet = getPowerSet(items)
  let bestPrice = 0
  let bestSet

  powerSet.forEach((set) => {
    if (getSetWeight(set) <= maxWeight) {
      if (getSetPrice(set) > bestPrice) {
        bestPrice = getSetPrice(set)
        bestSet = set
      }
    }
  })

  return bestSet
}

export default getBestSet
