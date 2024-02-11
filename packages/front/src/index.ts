import React from 'react'
import * as R from 'ramda'

//import './theme/status-colors.scss';
import configureAdminStore from './store/configureFrontendStore';

import axios from 'axios';
import App from './components/app/App'

import ReactDOM from "react-dom/client";


const div = document.getElementById('root') as HTMLDivElement

const store = configureAdminStore()
store.runSaga(rootFrontSaga, store, history)

window['store'] = store
window['R'] = R

const root = ReactDOM.createRoot(
    document.getElementById("root")
);
root.render(React.createElement(App, {store}));


