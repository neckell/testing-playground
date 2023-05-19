import { render } from "@testing-library/react"
import { Provider } from "react-redux"

import { store } from "../../redux/config/store"
import Home from "./Home"

test("renders learn react link", () => {
  const { getByText } = render(
    <Provider store={store}>
      <Home />
    </Provider>,
  )

  expect(getByText(/learn/i)).toBeInTheDocument()
})
