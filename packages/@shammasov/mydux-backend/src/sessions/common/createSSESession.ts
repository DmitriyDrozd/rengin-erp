import {SessionState, SSESession} from './SSESession';

/**
 * Create a new session and return the session instance once it has connected.
 */
const createSSESession = <State extends Record<string, unknown> = SessionState>(
	...args: ConstructorParameters<typeof SSESession>
): Promise<SSESession<State>> =>
	new Promise((resolve) => {
		const session = new SSESession<State>(...args);

		session.once("connected", () => {
			resolve(session);
		});
	});

export {createSSESession};
