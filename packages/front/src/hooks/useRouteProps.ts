import {useContext} from 'react';
import {__RouterContext, RouteComponentProps, StaticContext} from 'react-router';
import * as H from 'history';

export default <Params extends { [K in keyof Params]?: string } = {},
    S = H.LocationState,
    C extends StaticContext = StaticContext>() => {
    const ctx = useContext(__RouterContext as any as React.Context<RouteComponentProps<Params, C, S>>)
    return ctx
}
