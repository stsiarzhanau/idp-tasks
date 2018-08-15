import curry from './curry'

const add = (num1, num2, num3) => num1 + num2 + num3

describe('#curry()', () => {
  it(`takes arguments one by one and returns a result equal to the rsult of
    uncurried function called with all that arguments at once`, function () {
    expect(curry(add)(1)(2)(3)).to.equal(add(1, 2, 3))
  })
})
