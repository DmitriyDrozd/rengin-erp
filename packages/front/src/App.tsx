import React, {useState} from 'react'
import {Provider} from 'react-redux'
import {ConnectedRouter, history} from '@sha/router'
import {HistoryContext} from './contexts'
import UIRoot from './components/UIRoot'
import {useMount} from 'react-use'
import {BrowserRouter} from 'react-router-dom'
import {Router} from 'react-router-dom'

const App = ({store}) => {
    const [rendered, setRendered] = useState(false)
    useMount(() => {
        setRendered(true)
    })
    return (
        <Provider store={store}>
            <Router history={history}>
            <ConnectedRouter history={history} >
                    {
                     rendered &&   <UIRoot history={history}/>
                    }
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
