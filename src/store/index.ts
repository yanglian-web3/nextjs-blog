import { configureStore } from '@reduxjs/toolkit'

import blogEditReducer from "./blog-edit-slice"
import blogSearchReducer from "./blog-search-slice"
import userReducer from "./user-slice"

export const store = configureStore({
    reducer: {
        // 在这里添加你的 reducers
        blogEdit: blogEditReducer,
        blogSearch: blogSearchReducer,
        user: userReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
