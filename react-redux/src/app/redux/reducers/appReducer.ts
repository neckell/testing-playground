import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// import axios from 'axios'
import { API_BASE_URL } from '../../constants/base'
import { AppState } from './types'

// interface ModifiedNameResponse {
//   modifiedName: string
// }

const initialState: AppState = {
  name: '',
  isLoading: false,
}

interface BackendResponse {
  message: any[]
}

export const fetchModifiedName = createAsyncThunk(
  'app/modifyNameAsync',
  async () => {
    const response = await fetch(API_BASE_URL + `/assets?day=1`)
    const data: BackendResponse = await response.json()
    console.log(data)
    return data.message
  }
)

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchModifiedName.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchModifiedName.fulfilled, (state, action) => {
      state.isLoading = false
      state.name = 'LOADED'
    })
    builder.addCase(fetchModifiedName.rejected, (state) => {
      state.isLoading = false
    })
  },
})

// export const { setName } = appSlice.actions

export const appReducer = appSlice.reducer
