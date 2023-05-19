export const loadJSON = (target: any, callback: any) => {
  const xobj = new XMLHttpRequest()
  xobj.overrideMimeType("application/json")
  xobj.open("GET", target, true)
  xobj.onreadystatechange = () => {
    if (xobj.readyState === 4 && xobj.status === 200) {
      // .open will NOT return a value but simply returns undefined in async mode so use a callback
      callback(xobj.responseText)
    }
  }
  xobj.send(null)
}
