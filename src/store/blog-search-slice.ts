import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BlogState {
    searchValue: string,
    searchRefreshNum: number
}

const initialState: BlogState = {
    searchValue: '',
    searchRefreshNum: 0
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
        updateSearchRefreshNum: {
            reducer: (state, action: PayloadAction<number>) => {
                state.searchRefreshNum = action.payload
            },
            prepare: (searchValue: number) => ({
                payload: searchValue
            })
        },
    },
})

export const { updateSearchValue, updateSearchRefreshNum } = blogSlice.actions
export default blogSlice.reducer