import {Channel, createChannel} from '@sha/better-sse';

const channels: Map<string, Channel> = new Map<string, Channel>()

export const getAllSSEAdminChannels = () =>
    channels

export default (adminEmail) => {
    if (!channels.has(adminEmail))
        channels.set(adminEmail, createChannel())

    return channels.get(adminEmail)
}
