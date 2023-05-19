import { createBrowserRouter } from "react-router-dom"

import Home from "../components/home/Home"
import { Paths } from "./paths"

const router = createBrowserRouter([
  {
    path: Paths.home,
    Component: Home,
  },
])

export default router
