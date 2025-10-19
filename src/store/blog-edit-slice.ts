import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BlogState {
    title: string
    content: string
}

const initialState: BlogState = {
    title: '',
    content: '',
}

export const blogSlice = createSlice({
    name: 'blogEdit',
    initialState,
    reducers: {
        updateTitle: {
            reducer: (state, action: PayloadAction<string>) => {
                state.title = action.payload
            },
            prepare: (title: string) => ({
                payload: title
            })
        },
        updateContent: {
            reducer: (state, action: PayloadAction<string>) => {
                state.content = action.payload
            },
            prepare: (content: string) => ({
                payload: content
            })
        },
    },
})

export const { updateTitle, updateContent } = blogSlice.actions
export default blogSlice.reducer