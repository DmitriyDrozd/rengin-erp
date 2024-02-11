import {SSEChannel} from './SSEChannel';

const createSSEChannel = <State extends Record<string, unknown>>(
	...args: ConstructorParameters<typeof SSEChannel>
): SSEChannel<State> => new SSEChannel<State>(...args);

export {createSSEChannel};
