const isEmptyArray = (arr: any) => Array.isArray(arr) && arr.length === 0
const isEmptyObject = (obj: any) =>
  Object.getPrototypeOf(obj) === Object.prototype &&
  Object.keys(obj).length === 0

export const isNullOrEmpty = (val: any) => {
  return (
    val === null ||
    val === "" ||
    val === undefined ||
    isEmptyArray(val) ||
    isEmptyObject(val)
  )
}
