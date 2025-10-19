import { configureStore } from '@reduxjs/toolkit'

import blogEditReducer from "./blog-edit-slice"

export const store = configureStore({
    reducer: {
        // 在这里添加你的 reducers
        blogEdit: blogEditReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
