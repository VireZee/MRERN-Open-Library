import { configureStore, Store } from '@reduxjs/toolkit'
import AppAct from './actions/AppAction'
import NavAct from './actions/NavbarAction'
import RegAct from './actions/RegisterAction'
import LogAct from './actions/LoginAction'
import HomeAct from './actions/HomeAction'
import ColAct from './actions/CollectionAction'
import APIAct from './actions/APIAction'
import SetAct from './actions/SettingsAction'

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