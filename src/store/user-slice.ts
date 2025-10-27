import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {UserInfo} from "../types/user";

interface UserState {
    userInfo: UserInfo | null,
    token: string
}

const initialState: UserState = {
    userInfo: null,
    token: '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUserInfo: {
            reducer: (state, action: PayloadAction<UserInfo | null>) => {
                state.userInfo = action.payload
            },
            prepare: (userInfo: UserInfo | null) => ({
                payload: userInfo
            })
        },
        updateToken: {
            reducer: (state, action: PayloadAction<string>) => {
                state.token = action.payload
            },
            prepare: (token: string) => ({
                payload: token
            })
        },
    },
})

export const { updateUserInfo, updateToken } = userSlice.actions
export default userSlice.reducer