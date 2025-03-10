import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UserData {
    photo: string
    name: string
    uname: string
    email: string
}
interface State {
    [key: string]: string | undefined | null | UserData | Boolean
}
const initialState: State = {
    search: '',
    user: undefined,
    loadUser: true
}
const AppAction = createSlice({
    name: 'APP',
    initialState,
    reducers: {
        setUser: (state, { payload }: PayloadAction<null | UserData>) => {
            state['user'] = payload
            state['loadUser'] = false
        },
        setSearch: (state, { payload }: PayloadAction<string>) => {
            state['search'] = payload
        }
    }
})
export const { setUser, setSearch } = AppAction.actions
export default AppAction.reducer