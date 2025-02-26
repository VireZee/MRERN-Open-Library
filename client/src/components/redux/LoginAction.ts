import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
    [key: string]: string | boolean
}
const initialState: State = {
    emailOrUname: '',
    pass: '',
    show: false,
    error: ''
}
const LoginAction = createSlice({
    name: 'LOG',
    initialState,
    reducers: {
        change: (state, { payload: { name, value } }: PayloadAction<{ name: keyof State, value: string }>) => {
            state[name] = value
        },
        setShow: (state, { payload }: PayloadAction<boolean>) => {
            state['show'] = payload
        },
        setError: (state, { payload }: PayloadAction<string>) => {
            state['error'] = payload
        }
    }
})
export const { change, setShow, setError } = LoginAction.actions
export default LoginAction.reducer