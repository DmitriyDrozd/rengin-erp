import {createSSEChannel, SSEChannel} from "./common";
import {SSESessionState} from "./startSSESession";

const allSSESessionsChannel = createSSEChannel<SSESessionState>()
export const getAllSSESessionsChannel = () => {
    return allSSESessionsChannel
}


const userChannels: Map<string, SSEChannel> = new Map<string, SSEChannel>()

export const getAllSSEUserChannels = () =>
    userChannels

export const getSSEUserChannel = (userId: string) => {
    if (!userChannels.has(userId))
        userChannels.set(userId, createSSEChannel())

    return userChannels.get(userId)
}


const adminChannels: Map<string, SSEChannel> = new Map<string, SSEChannel>()

export const getAllSSEAdminChannels = () =>
    adminChannels

export const getSSEAdminChannel = (adminId: string) => {
    if (!adminChannels.has(adminId))
        adminChannels.set(adminId, createSSEChannel())

    return adminChannels.get(adminId)!
}