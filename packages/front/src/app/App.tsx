import React from 'react'
import {Provider} from 'react-redux'
import {ConfigProvider, Empty} from 'antd'
import 'dayjs/locale/ru'
import ruRU from 'antd/locale/en_US'
import {buildAdminStore} from "./buildAdminStore";
import {connectionSaga, connectionSlice} from "@shammasov/mydux";
import {AppRoutes} from "./AppRoutes";

const store = buildAdminStore()
store.run(connectionSaga)

store.dispatch(connectionSlice.actions.findConnectionRequested())
global.getStore = () => store
export const App = () => {
    return (
        <Provider store={store}>
            <div
                id="test-pro-layout"
                style={{
                    height: "100vh"
                }}
            >
                <ConfigProvider
                    theme={{
                        components: {
                            Form: {
                                marginLG: 4,
                                lineHeight: 2
                            },
                        },
                        token: {
                            borderRadius: 0,
                        }
                    }}
                    componentSize={'middle'}
                    locale={ruRU}
                    autoInsertSpaceInButton={true}
                    getTargetContainer={() => {
                        return document.getElementById('test-pro-layout') || document.body;
                    }}
                    renderEmpty={() => <Empty description={false}/>}
                >
                    <AppRoutes/>
                </ConfigProvider>
            </div>
        </Provider>
);

};

const redirectToLogin = ()  => {
    window.location.href = '/login'
    return null
}


export default App
