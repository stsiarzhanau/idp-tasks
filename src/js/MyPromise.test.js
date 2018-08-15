import MyPromise from './MyPromise'

const resPromise = new MyPromise((resolve) => {
  setTimeout(() => {
    resolve(1)
  }, 10)
})

const err = new Error('1')

const rejPromise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject(err)
  }, 10)
})

// CONSTRUCTOR
describe('#MyPromise() constructor', function () {
  it('expects single argument that is a resolver function', function () {
    expect(MyPromise.length).to.equal(1)
  })

  it('when called, throws an error if argument is not provided or it`s not a function')

  it('has method resolve()', function () {
    expect(MyPromise).to.have.own.property('resolve')
  })
  it('has method reject()', function () {
    expect(MyPromise).to.have.own.property('reject')
  })
  it('has method all()', function () {
    expect(MyPromise).to.have.own.property('all')
  })
  it('has method race()', function () {
    expect(MyPromise).to.have.own.property('race')
  })
  it('creates instances that receive method then() from prototype', function () {
    expect(resPromise).to.have.property('then').but.not.own.property('then')
  })
  it('creates instances that receive method catch() from prototype', function () {
    expect(resPromise).to.have.property('catch').but.not.own.property('catch')
  })
  it('creates instances that receive method finally() from prototype', function () {
    expect(resPromise).to.have.property('finally').but.not.own.property('finally')
  })
  it('creates instances that have own property `promiseStatus`', function () {
    expect(resPromise).to.have.own.property('promiseStatus')
  })
  it('creates instances that have own property `promiseValue`', function () {
    expect(resPromise).to.have.own.property('promiseValue')
  })
  it('creates instances that have own property `promiseResolveCallbacks`', function () {
    expect(resPromise).to.have.own.property('promiseResolveCallbacks')
  })
  it('creates instances that have own property `promiseRejectCallbacks`', function () {
    expect(resPromise).to.have.own.property('promiseRejectCallbacks')
  })
})

// RESOLVE
describe('#MyPromise.resolve()', function () {
  it('expects single argument that can be any value', function () {
    expect(MyPromise.resolve.length).to.equal(1)
  })

  it(`returns a promise resolved with the passed argument (if it's is not a
       promise or 'thenable'`, function () {
    const p = MyPromise.resolve(1)
    return expect(p).to.eventually.equal(1)
  })

  it('returns the passed argument (if passed argument is a promise)', function () {
    const p1 = MyPromise.resolve(1)
    const p2 = MyPromise.resolve(p1)
    return expect(p2).to.eventually.equal(1)
  })

  it('creates promise from the passed argument and returns that promise (if the argument is `tnenable`)')
})

// REJECT
describe('#MyPromise.reject()', function () {
  it('expects single argument that is a rejection reason', function () {
    expect(MyPromise.resolve.length).to.equal(1)
  })

  it('returns a promise rejected with the passed argument', function () {
    const p = MyPromise.reject(err)
    return expect(p).to.be.rejectedWith(err)
  })
})

// THEN
describe('#MyPromise.prototype.then()', function () {
  it('expects two arguments that are onResolved and onRejected callbacks', function () {
    expect(MyPromise.prototype.then.length).to.equal(2)
  })

  it(`returns pending promise that eventually gets resolved with callback return
       value (if callback returns a non-promise value)`, function () {
    const p2 = resPromise.then(val => val + 1)
    return expect(p2).to.eventually.equal(2)
  })

  it(`returns pending promise that eventually gets rejected with thrown error
       (if callback throws an error)`, function () {
    const p2 = resPromise.then((val) => { throw new Error(`${val + 1}`) })
    return expect(p2).to.be.rejectedWith('2')
  })

  it(`returns pending promise that eventually gets resolved with the value of the
       promise returned from callback (if callback returns an already resolved
       promise)`, function () {
    const p2 = resPromise.then(val => MyPromise.resolve(val + 1))
    return expect(p2).to.eventually.equal(2)
  })

  it(`returns pending promise that eventually gets rejected with the value of the
       promise returned from callback (if callback returns an already rejected
       promise)`, function () {
    const p2 = resPromise.then(val => MyPromise.reject(new Error(`${val + 1}`)))
    return expect(p2).to.be.rejectedWith('2')
  })

  it(`returns pending promise that eventually gets resolved with the value of the
       promise returned from callback when that promise is resolved (if callback
       returns a pending promise)`, function () {
    const p2 = resPromise.then(val => new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(val + 1)
      }, 20)
    }))
    return expect(p2).to.eventually.equal(2)
  })

  it(`returns pending promise that eventually gets rejected with the value of the
       promise returned from callback when that promise is rejected (if callback
       returns a pending promise)`, function () {
    const p2 = resPromise.then(val => new MyPromise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`${val + 1}`))
      }, 20)
    }))
    return expect(p2).to.be.rejectedWith('2')
  })

  it(`returns pending promise that eventually gets resolved with the value of
       original promise (if original promise is resolved and onResolved callback
       is not passed to then())`, function () {
    const p2 = resPromise.then()
    return expect(p2).to.eventually.equal(1)
  })

  it(`returns pending promise that eventually gets rejected with the value of
       original promise (if original promise is rejected and onRejected callback
       is not passed to then())`, function () {
    const p2 = rejPromise.then()
    return expect(p2).to.be.rejectedWith(err)
  })

  it('allows to chain subsequent then() calls', function () {
    const p3 = resPromise.then(val => val + 1).then(val => val + 1)
    return expect(p3).to.eventually.equal(3)
  })

  it(`calls onRejected callback when the promise that then() is called on is
       rejected`, function () {
    const p2 = rejPromise.then(
      val => val + 1,
      reason => (parseInt(reason.message, 10) + 1),
    )
    return expect(p2).to.eventually.equal(2)
  })
})

// CATCH
describe('#MyPromise.prototype.catch()', function () {
  it('expects single argument that is onRejected callback', function () {
    expect(MyPromise.prototype.catch.length).to.equal(1)
  })

  it(`returns pending promise that eventually gets resolved with callback return
       value (if callback returns a non-promise value)`, function () {
    const p2 = rejPromise.catch(reason => parseInt(reason.message, 10) + 1)
    return expect(p2).to.eventually.equal(2)
  })

  it(`returns pending promise that eventually gets rejected with thrown error
       (if callback throws an error)`, function () {
    const p2 = rejPromise.catch((reason) => {
      throw new Error(`${parseInt(reason.message, 10) + 1}`)
    })
    return expect(p2).to.be.rejectedWith('2')
  })

  it(`returns pending promise that eventually gets resolved with the value of the
       promise returned from callback (if callback returns an already resolved
       promise)`, function () {
    const p2 = rejPromise
      .catch(reason => MyPromise.resolve(parseInt(reason.message, 10) + 1))
    return expect(p2).to.eventually.equal(2)
  })

  it(`returns pending promise that eventually gets rejected with the value of the
       promise returned from callback (if callback returns an already rejected
       promise)`, function () {
    const p2 = rejPromise
      .catch(reason => MyPromise.reject(new Error(`${parseInt(reason.message, 10) + 1}`)))
    return expect(p2).to.be.rejectedWith('2')
  })

  it(`returns pending promise that eventually gets resolved with the value of the
       promise returned from callback when that promise is resolved (if callback
       returns a pending promise)`, function () {
    const p2 = rejPromise.catch(reason => new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(parseInt(reason.message, 10) + 1)
      }, 20)
    }))
    return expect(p2).to.eventually.equal(2)
  })

  it(`returns pending promise that eventually gets rejected with the value of the
       promise returned from callback when that promise is rejected (if callback
       returns a pending promise)`, function () {
    const p2 = rejPromise.catch(reason => new MyPromise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`${parseInt(reason.message, 10) + 1}`))
      }, 20)
    }))
    return expect(p2).to.be.rejectedWith('2')
  })

  it(`returns pending promise that eventually gets rejected with the value of
       original promise (if onRejected callback is not passed to catch())`, function () {
    const p2 = rejPromise.catch()
    return expect(p2).to.be.rejectedWith(err)
  })

  it('allows to chain subsequent catch() calls', function () {
    const p3 = rejPromise
      .catch(reason => MyPromise.reject(new Error(`${parseInt(reason.message, 10) + 1}`)))
      .catch(reason => parseInt(reason.message, 10) + 1)
    return expect(p3).to.eventually.equal(3)
  })
})

// FINALLY
describe('#MyPromise.prototype.finally()', function () {
  it(`expects single argument (that is a callback, expected to be called when
       promise either resolved or rejected)`, function () {
    expect(MyPromise.prototype.finally.length).to.equal(1)
  })

  it(`returns pending promise that eventually gets resolved with the value of
        original promise (if callback returns a non-promise value and original
        promise is resolved)`, function () {
    const p2 = resPromise.finally(() => 2)
    return expect(p2).to.eventually.equal(1)
  })

  it(`returns pending promise that eventually gets rejected with the value of
        original promise (if callback returns a non-promise value and original
        promise is rejected)`, function () {
    const p2 = rejPromise.finally(() => 2)
    return expect(p2).to.be.rejectedWith(err)
  })

  it(`returns pending promise that eventually gets rejected with thrown error
       (if callback throws an error and original promise is resolved)`, function () {
    const p2 = resPromise.finally(() => { throw new Error('2') })
    return expect(p2).to.be.rejectedWith('2')
  })

  it(`returns pending promise that eventually gets rejected with thrown error
       (if callback throws an error and original promise is rejected)`, function () {
    const p2 = rejPromise.finally(() => { throw new Error('2') })
    return expect(p2).to.be.rejectedWith('2')
  })

  it(`returns pending promise that eventually gets resolved with the value of
       original promise (if callback returns an already resolved promise and original
        promise is resolved)`, function () {
    const p2 = resPromise.finally(() => MyPromise.resolve(2))
    return expect(p2).to.eventually.equal(1)
  })

  it(`returns pending promise that eventually gets rejected with the value of
       original promise (if callback returns an already resolved promise and original
        promise is rejected)`, function () {
    const p2 = rejPromise.finally(() => MyPromise.resolve(2))
    return expect(p2).to.be.rejectedWith(err)
  })

  it(`returns pending promise that eventually gets rejected with the value of the
       promise returned from callback (if callback returns an already rejected
       promise and original promise is resolved)`, function () {
    const p2 = resPromise.finally(() => MyPromise.reject(new Error('2')))
    return expect(p2).to.be.rejectedWith('2')
  })

  it(`returns pending promise that eventually gets rejected with the value of the
       promise returned from callback (if callback returns an already rejected
       promise and original promise is rejected)`, function () {
    const p2 = rejPromise.finally(() => MyPromise.reject(new Error('2')))
    return expect(p2).to.be.rejectedWith('2')
  })

  it(`returns pending promise that eventually gets resolved with the value of
       original promise (if callback returns a pending promise and original
       promise is resolved)`, function () {
    const p2 = resPromise.finally(() => new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(2)
      }, 20)
    }))
    return expect(p2).to.eventually.equal(1)
  })

  it(`returns pending promise that eventually gets rejected with the value of
       original promise (if callback returns a pending promise and original
       promise is rejected)`, function () {
    const p2 = rejPromise.finally(() => new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(2)
      }, 20)
    }))
    return expect(p2).to.be.rejectedWith(err)
  })

  it(`returns pending promise that eventually gets resolved with the value of
       original promise (if original promise is resolved and onFinally callback
       is not passed to finally())`, function () {
    const p2 = resPromise.finally()
    return expect(p2).to.eventually.equal(1)
  })

  it(`returns pending promise that eventually gets rejected with the value of
       original promise (if original promise is rejected and onRejected callback
       is not passed to finally())`, function () {
    const p2 = rejPromise.finally()
    return expect(p2).to.be.rejectedWith(err)
  })

  it('allows to chain subsequent finally() calls', function () {
    const p3 = resPromise
      .finally(() => 2)
      .finally(() => 3)
    return expect(p3).to.eventually.equal(1)
  })
})

// RACE
describe('#MyPromise.race()', function () {
  it('expects single argument that is an iterable object', function () {
    expect(MyPromise.race.length).to.equal(1)
  })

  it(`throws a TypeError if the passed argument is not an iterable object and
       returns a promise rejected with that error`)

  it(`returns a promise that resolves or rejects as soon as one of the promises
       in the iterable resolves or rejects, with the value or reason from that
       promise (case when the first settled promise is resolved).`, function () {
    const p1 = new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, 10)
    })

    const p2 = new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(2)
      }, 5)
    })

    const p3 = new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(3)
      }, 20)
    })

    const p4 = MyPromise.race([p1, p2, p3])
    return expect(p4).to.eventually.equal(2)
  })

  it(`returns a promise that resolves or rejects as soon as one of the promises
       in the iterable resolves or rejects, with the value or reason from that
       promise (case when the first settled promise is rejected).`, function () {
    const p1 = new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, 10)
    })

    const p2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        reject(err)
      }, 5)
    })

    const p3 = new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(3)
      }, 20)
    })

    const p4 = MyPromise.race([p1, p2, p3])
    return expect(p4).to.be.rejectedWith(err)
  })

  it(`returns a promise that resolves with the value of the first met non-promise
       value (if such a value presents in the iterable).`, function () {
    const p1 = new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, 0)
    })

    const p2 = 42

    const p3 = new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(3)
      }, 5)
    })

    const p4 = MyPromise.race([p1, p2, p3])
    return expect(p4).to.eventually.equal(42)
  })

  it('returns a pending promise if passed iterable is `empty`')
})

// ALL
describe('#MyPromise.all()', function () {
  it('expects single argument that is an iterable object', function () {
    expect(MyPromise.all.length).to.equal(1)
  })

  it(`throws a TypeError if the passed argument is not an iterable object and
       returns a promise rejected with that error`)

  it(`returns a pending promise that gets resolved with the array containing
       all the values of the iterable passed as argument (also non-promise
       values).`, function () {
    const p1 = new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, 10)
    })

    const p2 = 42

    const p3 = new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(3)
      }, 20)
    })

    const p4 = MyPromise.all([p1, p2, p3])
    return expect(p4).to.eventually.deep.equal([1, 42, 3])
  })

  it(`returns a pending promise that gets rejected with the value of the promise
       that rejected, whether or not the other promises have resolved (if any
       of the passed-in promises rejects).`, function () {
    const p1 = new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, 10)
    })

    const p2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        reject(err)
      }, 5)
    })

    const p3 = new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(3)
      }, 20)
    })

    const p4 = MyPromise.all([p1, p2, p3])
    return expect(p4).to.be.rejectedWith(err)
  })

  it(`returns (synchronously) an already resolved promise (if an empty iterable
       is passed.`, function () {
    const p = MyPromise.all([])
    return expect(p).to.eventually.deep.equal([])
  })
})

// MIXED
describe('then().catch() chain', function () {
  it('should pass error thrown in then() to catch()', function () {
    const p2 = resPromise
      .then(() => { throw err })
      // error is thrown in callback, so then() promise is rejected with error
      .then(() => 2)
      // 'Thrower' function is called, then() promise is rejected with error
      .catch(reason => reason)
      // catch() promise is resolved with error
    return expect(p2).to.eventually.equal(err)
  })
})
