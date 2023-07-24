import EventSource from 'eventsource';
import {END, eventChannel} from 'typed-redux-saga'

export function subscribeToSSE(eventSrc: EventSource) {
    return eventChannel((emitter) => {
        eventSrc.onopen = (ev: any) => {
            console.info('connection is established');
            emitter(ev);
        };

        eventSrc.onerror = (err: any) => {
            console.error(err);
        };
        eventSrc.onmessage = function (message) {
            var result = message.data ? JSON.parse(message.data) : message;
            console.log("New payment:");
            console.log(result);
        };

        eventSrc.addEventListener('disconnect', (event) => emitter({
            type: 'DISCONNECT',
            payload: JSON.parse(event.data)
        }), false)

        return () => {
            console.info('closing connection...');
            eventSrc.close();
            emitter(END);
        };
    });
}
