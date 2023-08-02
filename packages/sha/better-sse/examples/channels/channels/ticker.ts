import {createChannel} from '@sha/better-sse';

/**
 * Create a channel that allows you to broadcast messages
 * to multiple sessions at once.
 */
const ticker = createChannel();

/**
 * Count upwards and broadcast the count to every client once per second.
 */
let count = 0;

setInterval(() => {
	ticker.broadcast(count++, "tick");
}, 1000);

/**
 * Keep track of how many clients are subscribed to the channel, and
 * inform existing clients of the count every time a session
 * is registered and deregistered.
 */
const broadcastSessionCount = () => {
	ticker.broadcast(ticker.sessionCount, "session-count");
};

ticker
	.on("session-registered", broadcastSessionCount)
	.on("session-deregistered", broadcastSessionCount);

export {ticker};
