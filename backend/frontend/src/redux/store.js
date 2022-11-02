import { configureStore } from '@reduxjs/toolkit'
import cardataReducer from './features/cardata/cardataSlice'

export default configureStore({
  reducer: {
    cardata: cardataReducer,
  },
})