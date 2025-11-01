import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BlogState {
    searchValue: string
}

const initialState: BlogState = {
    searchValue: '',
}

export const blogSlice = createSlice({
    name: 'blogSearch',
    initialState,
    reducers: {
        updateSearchValue: {
            reducer: (state, action: PayloadAction<string>) => {
                state.searchValue = action.payload
            },
            prepare: (searchValue: string) => ({
                payload: searchValue
            })
        },
    },
})

export const { updateSearchValue } = blogSlice.actions
export default blogSlice.reducer