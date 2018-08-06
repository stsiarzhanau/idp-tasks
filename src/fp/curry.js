const curry = fn => (
  (function next(prevArgs) {
    return (arg) => {
      const args = [...prevArgs, arg]
      if (args.length >= fn.length) {
        return fn(...args)
      }
      return next(args)
    }
  })([])
)

export default curry
