
import React from 'react'
import * as R from 'ramda'
import * as ReactDom from 'react-dom/client'
//import './theme/status-colors.scss';
import axios from 'axios';

import {App} from "./app/App";
import {orm} from "iso";

window['axios'] = axios
window['orm'] = orm
const div = document.getElementById('root') as HTMLDivElement


window['R'] = R

const root = ReactDom.createRoot(
    div
);
root.render(React.createElement(App));