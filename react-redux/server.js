const path = require("path")
const express = require("express")

const app = express()
const DIST_DIR = path.join(__dirname, "/dist")
const port = process.env.PORT || 3000
app.use(express.static(DIST_DIR))
app.get("*", (req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"))
})
app.listen(port, () => {
  console.log("Server is up!")
})
