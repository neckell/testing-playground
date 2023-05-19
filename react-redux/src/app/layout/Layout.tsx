import { FC } from "react"
import { RouterProvider } from "react-router-dom"

import router from "../routes/router"

const Layout: FC = () => {
  return <RouterProvider router={router} />
}

export default Layout
