import React, {useState} from 'react'
import {Provider} from 'react-redux'
import {ConnectedRouter, history} from '@sha/router'
import { GOOGLE_MAPS_API_KEY } from '../../env';
import UIRoot from './UIRoot'
import {useMount} from 'react-use'
import {Router} from 'react-router-dom'
import {ConfigProvider, Empty} from 'antd'
import ruRU from 'antd/locale/ru_RU'
import {BlinkDbProvider} from '@blinkdb/react'
import {createDB} from 'blinkdb'
import {blinkModel} from './blink-db-model'
import {FrontStore} from "../../hooks/common/useFrontStore";
import {APIProvider} from '@vis.gl/react-google-maps';
import { createThemeHook, ThemeContext } from '../../hooks/useTheme';

const App = ({store}: {store: FrontStore}) => {
    const theme = createThemeHook(true);
    const [rendered, setRendered] = useState(false)
    useMount(() => {
        setRendered(true);
    });

    return (
        <BlinkDbProvider db={createDB()} model={blinkModel}>
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                <Provider store={store}>
                    <ThemeContext.Provider value={theme}>
                        <ConfigProvider
                            theme={{
                                ...theme.algorithm,
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
                            button={{ autoInsertSpace: true }}
                            getTargetContainer={() => {
                                return document.getElementById('test-pro-layout') || document.body;
                            }}
                            renderEmpty={()=><Empty description={false} />}
                        >
                            <Router history={history}>
                                <ConnectedRouter history={history} >
                                    <div
                                        id="test-pro-layout"
                                        style={{
                                            height: "100vh"
                                        }}
                                    >
                                        {
                                            rendered && (
                                                <UIRoot history={history}/>
                                            )
                                        }
                                    </div>
                                </ConnectedRouter>
                            </Router>
                        </ConfigProvider>
                    </ThemeContext.Provider>
                </Provider>
            </APIProvider>
        </BlinkDbProvider>
    )
}
/*
<ConnectedRouter history={history} omitRouter={true}>
                        <DesktopRoot />
                    </ConnectedRouter>
 */
export default App
