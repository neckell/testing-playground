import { cleanup } from "@testing-library/react"

import { camelToSnake } from "./api-utils"
import { isNullOrEmpty } from "./validations"

afterEach(cleanup)

describe("Utils func", () => {
  it("should transform snake to camel", () => {
    const obj = {
      postal_code: "3100",
      main_address: "Av. Libertador 111",
    }
    const desired = {
      postalCode: "3100",
      mainAddress: "Av. Libertador 111",
    }
    const result = camelToSnake(obj)
    expect(result.postalCode === desired.postalCode).toBeTruthy()
    expect(result.mainAddress === desired.mainAddress).toBeTruthy()
  })
  it("should validate wrong input data", () => {
    const val1 = null
    const val2 = ""
    const val3 = undefined
    const val4 = []
    const val5 = {}
    expect(isNullOrEmpty(val1)).toBeTruthy()
    expect(isNullOrEmpty(val2)).toBeTruthy()
    expect(isNullOrEmpty(val3)).toBeTruthy()
    expect(isNullOrEmpty(val4)).toBeTruthy()
    expect(isNullOrEmpty(val5)).toBeTruthy()
  })
  it("should validate ok input data", () => {
    const val1 = 1
    const val2 = "1"
    const val3 = false
    const val4 = ["1"]
    const val5 = { 1: 1 }
    const val6 = true
    expect(!isNullOrEmpty(val1)).toBeTruthy()
    expect(!isNullOrEmpty(val2)).toBeTruthy()
    expect(!isNullOrEmpty(val3)).toBeTruthy()
    expect(!isNullOrEmpty(val4)).toBeTruthy()
    expect(!isNullOrEmpty(val5)).toBeTruthy()
    expect(!isNullOrEmpty(val6)).toBeTruthy()
  })
})
