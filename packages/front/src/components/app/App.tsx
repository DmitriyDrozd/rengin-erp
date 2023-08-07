import React, {useState} from 'react'
import {Provider} from 'react-redux'
import {ConnectedRouter, history} from '@sha/router'
import UIRoot from './UIRoot'
import {useMount} from 'react-use'
import {Router} from 'react-router-dom'
import {ConfigProvider} from 'antd'
import {ProConfigProvider} from '@ant-design/pro-components'
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import ruRU from 'antd/locale/ru_RU';
const App = ({store}) => {
    const [rendered, setRendered] = useState(false)
    useMount(() => {
        setRendered(true)
    })
    return (
        <Provider store={store}>
            <Router history={history}>
            <ConnectedRouter history={history} >
                <div
                    id="test-pro-layout"
                    style={{
                        height: "100vh"
                    }}
                >
                    <ProConfigProvider hashed={false} >
                        <ConfigProvider
                            theme={{
                                components: {
                                    Form: {
                                        marginLG:4
                                    }
                                },
                                token: {
                                    borderRadius:0,
                                }
                            }}
                            componentSize={'middle'}
                            locale={ruRU}
                            autoInsertSpaceInButton={true}
                            getTargetContainer={() => {
                                return document.getElementById('test-pro-layout') || document.body;
                            }}
                        >
                    {
                     rendered &&   <UIRoot history={history}/>
                    }
                        </ConfigProvider>
                    </ProConfigProvider>
                </div>
            </ConnectedRouter>
            </Router>
        </Provider>

    )

}
/*
<ConnectedRouter history={history} omitRouter={true}>
                        <DesktopRoot />
                    </ConnectedRouter>
 */
export default App
