import { configureStore, Store } from '@reduxjs/toolkit'
import AppAct from './AppAction'
import NavAct from './NavbarAction'
import RegAct from './RegisterAction'
import LogAct from './LoginAction'
import HomeAct from './HomeAction'
import ColAct from './CollectionAction'
import APIAct from './APIAction'
import SetAct from './SettingsAction'

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