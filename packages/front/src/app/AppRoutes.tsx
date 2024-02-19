import React, {useState} from "react";
import {useMount} from "react-use";
import {useStore} from "react-redux";
import {AdminStore} from "./buildAdminStore";
import {ReduxRouter} from "@lagunovsky/redux-react-router";
import {Route, Routes} from "react-router-dom";
import LoginPage from "../components/auth-views/LoginPage";
import ForgotPasswordPage from "../components/auth-views/ForgotPasswordPage";
import {InAppView} from "../components/in-app/InAppView";
import {pathnames} from "./pathnames";
import {disposePreloader} from "@shammasov/mydux";
import {ProtectedRoute} from "./ProtectedRoute";


export const AppRoutes = () => {
    const [rendered, setRendered] = useState(false)
    useMount(() => {
        setRendered(true)
        disposePreloader()
    })

    const store = useStore() as any as AdminStore

    return (
        <ReduxRouter history={store.context.history}>

            <Routes >
                <Route path={pathnames.LOGIN} element={<LoginPage/>} />
                <Route path={pathnames.FORGOT} element={<ForgotPasswordPage/>}/>
                <Route  element={<ProtectedRoute><InAppView/></ProtectedRoute>}   path={pathnames.IN}/>
            </Routes>

        </ReduxRouter>


    )

}

