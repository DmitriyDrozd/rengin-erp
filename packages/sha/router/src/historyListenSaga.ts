import {eventChannel} from "redux-saga";
import {take} from "typed-redux-saga";
import {History} from 'history'

export default function* routeReadSaga(history: History) {
    const routeChannel = eventChannel(emitter => {
        history.listen(({location, action}) => {

            emitter({ location, action });
        });
        return () => {
            // clearInterval(interval)
        };
    });
    try {
        while (true) {
            let message = yield* take(routeChannel);
            console.log(`route: `, message);
        }
    } finally {
        console.log("route terminated");
    }
}
