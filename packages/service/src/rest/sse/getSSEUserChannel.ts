import {Channel, createChannel} from '@sha/better-sse';

const channels: Map<string, Channel> = new Map<string, Channel>()

export const getAllSSEUserChannels = () =>
    channels

export default (userId) => {
    if (!channels.has(userId))
        channels.set(userId, createChannel())

    return channels.get(userId)
}
