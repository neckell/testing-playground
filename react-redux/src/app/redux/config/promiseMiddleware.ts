/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
export default function promiseMiddleware() {
  return (next: any) => (action: any) => {
    const { promise, type, ...rest } = action

    if (!promise) return next(action)

    const SUCCESS = type + "_SUCCESS"
    const REQUEST = type + "_REQUEST"
    const FAILURE = type + "_FAILURE"
    next({ ...rest, type: REQUEST })
    return promise
      .then((resp: any) => {
        next({ ...rest, resp, type: SUCCESS })
        return true
      })
      .catch((error: any) => {
        next({ ...rest, error, type: FAILURE })
        return false
      })
  }
}
