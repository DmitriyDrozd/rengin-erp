import {createChannel} from "@sha/better-sse";

const allSSESessionsChannel = createChannel()
export default () => {
    return allSSESessionsChannel
}
