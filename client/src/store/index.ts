import type { Store } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import AppAct from './slices/core/App'
import NavAct from './slices/layouts/Navbar'
import RegAct from './slices/auth/Register'
import LogAct from './slices/auth/Login'
import HomeAct from './slices/views/Home'
import ColAct from './slices/views/Collection'
import APIAct from './slices/views/API'
import SetAct from './slices/auth/Settings'

const ReduxStore: Store = configureStore({
    reducer: {
        APP: AppAct,
        NAV: NavAct,
        REG: RegAct,
        LOG: LogAct,
        HOME: HomeAct,
        COL: ColAct,
        API: APIAct,
        SET: SetAct
    }
})
export type RootState = ReturnType<typeof ReduxStore.getState>
export default ReduxStore