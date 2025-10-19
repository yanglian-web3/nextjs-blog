import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BlogState {
    editorToolsHeight: number
}

const initialState: BlogState = {
    editorToolsHeight: 74,
}

export const editorSlice = createSlice({
    name: 'editorTools',
    initialState,
    reducers: {
        updateEditorToolsHeight: {
            reducer: (state, action: PayloadAction<string>) => {
                state.editor = action.payload
            },
            prepare: (editor: any) => ({
                payload: editor
            })
        },
    },
})

export const { updateEditorToolsHeight } = editorSlice.actions
export default editorSlice.reducer