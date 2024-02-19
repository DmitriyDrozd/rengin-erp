import {Navigate} from "react-router";
import {useAdminState} from "./buildAdminStore";
import {pathnames} from "./pathnames";
import {PropsWithChildren} from "react";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
    const state = useAdminState()

    if (!state.dispatcher.userId) {
        return <Navigate to={pathnames.LOGIN} replace />;
    }

    return children;
};