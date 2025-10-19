import { configureStore } from '@reduxjs/toolkit'

import blogEditReducer from "./blog-edit-slice"
import editorToolsReducer from "./editor-tools-slice"

export const store = configureStore({
    reducer: {
        // 在这里添加你的 reducers
        blogEdit: blogEditReducer,
        editorTools: editorToolsReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
