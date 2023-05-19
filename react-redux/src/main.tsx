import "./main.css"

import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"

import Layout from "./app/layout/Layout"
import { store } from "./app/redux/config/store"
import reportWebVitals from "./reportWebVitals"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Layout />
    </Provider>
  </React.StrictMode>,
)

reportWebVitals()
