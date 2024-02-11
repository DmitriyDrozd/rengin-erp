import {getContext} from "typed-redux-saga";
import {ServerContext, ServerStore} from "./configureServerStore";

export function* getServerContext() {
    const ctx: ServerContext = yield* getContext<ServerContext>('context')
    return ctx
} //var remotedev = require('remotedev-server');
//remotedev({ hostname: 'localhost', port: 8000 });