import {composeWithDevTools} from 'redux-devtools-extension';

const arrayLimit = 50
const composeWithReduxDevTools = (name = 'App printman') => composeWithDevTools({

    name,
    trace: true,
    traceLimit: 25,
    /*actionSanitizer: action =>
        (action.type.endsWith("reset") && isArray(action.payload))
            ? {...action, payload: take(arrayLimit, action.payload)}
            : action,*/
    latency: 200,
    maxAge: 200,
    /*serialize: {
        replacer: (key, value) => {

            if (isArray(value) && value.length > arrayLimit) { // use your custom data type checker
                return {
                    init: take(arrayLimit, value), // ImmutableJS custom method to get JS data as array
                    __serializedType__: 'LongArray' // mark you custom data type to show and retrieve back
                }
            }
            return value
        }
    } as any*/

})


export default composeWithReduxDevTools
