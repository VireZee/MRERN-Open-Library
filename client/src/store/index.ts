import { configureStore, Store } from '@reduxjs/toolkit'
import AppAct from './slices/App'
import NavAct from './slices/Navbar'
import RegAct from './slices/Register'
import LogAct from './slices/Login'
import HomeAct from './slices/Home'
import ColAct from './slices/Collection'
import APIAct from './slices/API'
import SetAct from './slices/Settings'

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