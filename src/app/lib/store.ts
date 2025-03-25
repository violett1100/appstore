import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '@/app/redux/counterSlice' // 引入 Counter Slice

export const store = configureStore({
    reducer: {
        counter: counterReducer, // 註冊 reducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
