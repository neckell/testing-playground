import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { API_BASE_URL } from "../constants/base"

export interface Show {
  start: string
  band: string
  stage: string
}

export interface Asset {
  scenario: Show[]
}

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getAssetsByDay: builder.query<Asset, string>({
      query: (day) => `assets?day=${day}`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAssetsByDayQuery } = baseApi
