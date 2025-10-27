import { configureStore } from '@reduxjs/toolkit'

import blogEditReducer from "./blog-edit-slice"
import userReducer from "./user-slice"

export const store = configureStore({
    reducer: {
        // 在这里添加你的 reducers
        blogEdit: blogEditReducer,
        user: userReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
