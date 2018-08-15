const noop = () => {}

const handleCallback = (cb, promiseValue) => {
  setTimeout(() => {
    cb(promiseValue)
  }, 0)
}

function runCallbacks() {
  const callbacks = this.promiseStatus === 'resolved'
    ? this.promiseResolveCallbacks
    : this.promiseRejectCallbacks

  callbacks.forEach((cb) => {
    handleCallback(cb, this.promiseValue)
  })
}

function resolveFunc(value) {
  this.promiseStatus = 'resolved'
  this.promiseValue = value
  runCallbacks.call(this)
}

function rejectFunc(reason) {
  this.promiseStatus = 'rejected'
  this.promiseValue = reason
  runCallbacks.call(this)
}

const resolvePromise = (promise, resolver) => {
  try {
    resolver(resolveFunc.bind(promise), rejectFunc.bind(promise))
  } catch (ex) {
    rejectFunc.call(promise, ex)
  }
}

function MyPromise(resolver) {
  if (typeof resolver !== 'function') {
    const errorMessage = `Promise resolver ${typeof resolver} is not a function`
    throw new TypeError(errorMessage)
  }

  this.promiseStatus = 'pending'
  this.promiseValue = undefined
  this.promiseResolveCallbacks = []
  this.promiseRejectCallbacks = []

  resolvePromise(this, resolver)
}

const resolveThenPromise = (thenPromise, result) => {
  if (!(result instanceof MyPromise)) {
    resolveFunc.call(thenPromise, result)
  } else {
    if (result.promiseStatus === 'resolved') {
      resolveFunc.call(thenPromise, result.promiseValue)
    }
    if (result.promiseStatus === 'rejected') {
      rejectFunc.call(thenPromise, result.promiseValue)
    }
    if (result.promiseStatus === 'pending') {
      result.then((value) => {
        resolveFunc.call(thenPromise, value)
      }, (reason) => {
        rejectFunc.call(thenPromise, reason)
      })
    }
  }
}

const resolveFinallyPromise = (thenPromise, cbResult, origPromise) => {
  if (cbResult instanceof MyPromise && cbResult.promiseStatus === 'rejected') {
    rejectFunc.call(thenPromise, cbResult.promiseValue)
  } else {
    if (origPromise.promiseStatus === 'resolved') {
      resolveFunc.call(thenPromise, origPromise.promiseValue)
    }
    if (origPromise.promiseStatus === 'rejected') {
      rejectFunc.call(thenPromise, origPromise.promiseValue)
    }
    if (origPromise.promiseStatus === 'pending') {
      origPromise.then((value) => {
        resolveFunc.call(thenPromise, value)
      }, (reason) => {
        rejectFunc.call(thenPromise, reason)
      })
    }
  }
}

function handleThenCallbacks(onResolved, onRejected, thenPromise) {
  if (typeof onResolved !== 'function') {
    onResolved = val => val
  }

  if (typeof onRejected !== 'function') {
    onRejected = (reason) => { throw reason }
  }

  function wrappedCallback(cb, val) {
    let result
    try {
      result = cb(val)
    } catch (ex) {
      rejectFunc.call(thenPromise, ex)
      return
    }
    resolveThenPromise(thenPromise, result)
  }

  if (this.promiseStatus === 'pending') {
    this.promiseResolveCallbacks.push(wrappedCallback.bind(null, onResolved))
    this.promiseRejectCallbacks.push(wrappedCallback.bind(null, onRejected))
    return
  }

  const cb = this.promiseStatus === 'resolved' ? onResolved : onRejected
  handleCallback(wrappedCallback.bind(null, cb), this.promiseValue)
}

function handleFinallyCallback(onFinally, thenPromise) {
  if (typeof onFinally !== 'function') {
    onFinally = val => val
  }

  function wrappedCallback(cb) {
    const origPromise = this
    let cbResult

    try {
      cbResult = cb()
    } catch (ex) {
      rejectFunc.call(thenPromise, ex)
      return
    }

    resolveFinallyPromise(thenPromise, cbResult, origPromise)
  }

  if (this.promiseStatus === 'pending') {
    this.promiseResolveCallbacks.push(wrappedCallback.bind(this, onFinally))
    this.promiseRejectCallbacks.push(wrappedCallback.bind(this, onFinally))
    return
  }

  handleCallback(wrappedCallback.bind(this, onFinally))
}

MyPromise.resolve = (value) => {
  if (value instanceof MyPromise) {
    return value
  }
  // TODO: handle `thenable`
  return new MyPromise((resolve) => {
    resolve(value)
  })
}

MyPromise.reject = reason => (
  new MyPromise((resolve, reject) => {
    reject(reason)
  })
)

MyPromise.all = (iterable) => {
  if (iterable.length === 0) {
    return MyPromise.resolve([])
  }
  const res = new MyPromise(noop)
  const resultArray = []
  let rejected = false

  // TODO: check if passed argument is not iterable, throw TypeError and return
  // promise rejected with that error

  iterable.forEach((el, i) => {
    if (!(el instanceof MyPromise)) {
      resultArray[i] = el
      if (resultArray.length === iterable.length) {
        setTimeout(() => {
          resolveFunc.call(res, resultArray)
        }, 0)
      }
    } else {
      el.then((val) => {
        resultArray[i] = val
        if (resultArray.length === iterable.length && !rejected) {
          resolveFunc.call(res, resultArray)
        }
      }, (reason) => {
        rejected = true
        rejectFunc.call(res, reason)
      })
    }
  })

  return res
}

MyPromise.race = (iterable) => {
  const res = new MyPromise(noop)
  let settled = false

  // TODO: check if passed argument is not iterable, throw TypeError and return
  // promise rejected with that error

  // TODO: return pending promise if passed iterable is 'empty'

  iterable.forEach((el) => {
    if (!(el instanceof MyPromise)) {
      resolveFunc.call(res, el)
    } else {
      el.finally(() => {
        if (!settled) {
          settled = true
          if (el.promiseStatus === 'resolved') {
            resolveFunc.call(res, el.promiseValue)
          }
          if (el.promiseStatus === 'rejected') {
            rejectFunc.call(res, el.promiseValue)
          }
        }
      })
    }
  })

  return res
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  const thenPromise = new MyPromise(noop)
  handleThenCallbacks.call(this, onResolved, onRejected, thenPromise)
  return thenPromise
}

MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

MyPromise.prototype.finally = function (onFinally) {
  const thenPromise = new MyPromise(noop)
  handleFinallyCallback.call(this, onFinally, thenPromise)
  return thenPromise
}

export default MyPromise
