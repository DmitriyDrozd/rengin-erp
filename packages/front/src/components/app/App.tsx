import React, {useState} from 'react'
import {Provider} from 'react-redux'
import {ConnectedRouter, history} from '@sha/router'
import UIRoot from './UIRoot'
import {useMount} from 'react-use'
import {Router} from 'react-router-dom'
import {ConfigProvider, DatePicker, Empty} from 'antd'
import {ProConfigProvider} from '@ant-design/pro-provider'
import 'dayjs/locale/ru'
import ruRU from 'antd/locale/en_US'
import {BlinkDbProvider} from '@blinkdb/react'
import {createDB} from 'blinkdb'
import {blinkModel} from './blink-db-model'


const App = ({store}) => {
    const [rendered, setRendered] = useState(false)
    useMount(() => {
        setRendered(true)
    })
    return (
        <BlinkDbProvider db={createDB()} model={blinkModel}>
        <Provider store={store}>
            <Router history={history}>
            <ConnectedRouter history={history} >
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
                                    marginLG:4,
                                    lineHeight:2
                                },
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
                        renderEmpty={()=><Empty description={false} />}
                    >

                    {
                     rendered &&   <UIRoot history={history}/>
                    }

                        </ConfigProvider>

                </div>
            </ConnectedRouter>
            </Router>
        </Provider>
        </BlinkDbProvider>

    )

}
/*
<ConnectedRouter history={history} omitRouter={true}>
                        <DesktopRoot />
                    </ConnectedRouter>
 */
export default App
