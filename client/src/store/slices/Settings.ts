import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
    [key: string]: boolean | number | string | { old: boolean, new: boolean } | Errors
}
const initialState: State = {
    isDropdownOpen: false,
    photo: '',
    name: '',
    uname: '',
    email: '',
    oldPass: '',
    newPass: '',
    rePass: '',
    show: { old: false, new: false },
    errors: {}
}
export interface Errors {
    photo?: string
    name?: string
    uname?: string
    email?: string
    oldPass?: string
    newPass?: string
    rePass?: string
}
const SettingsAction = createSlice({
    name: 'SET',
    initialState,
    reducers: {
        setIsDropdownOpen: (state, { payload }: PayloadAction<boolean>) => {
            state['isDropdownOpen'] = payload
        },
        change: (state, { payload: { name, value } }: PayloadAction<{ name: keyof State, value: number | string }>) => {
            state[name] = value
        },
        setShow: (state, { payload }: PayloadAction<{ old: boolean; new: boolean }>) => {
            state['show'] = payload
        },
        setErrors: (state, { payload }: PayloadAction<Errors>) => {
            state['errors'] = payload
        }
    }
})
export const { setIsDropdownOpen, change, setShow, setErrors } = SettingsAction.actions
export default SettingsAction.reducer