import {createSession, Session,} from '@sha/better-sse';
import getSSEAllSesionsChannel from './getSSEAllSesionsChannel';

export type SSESessionState = {
    userId: string
    storeGuid: string
    headers: any
    ip: string

}

export const filterNotStoreGuid = (storeGuid: string) => (session: Session<SSESessionState>): boolean =>
    session.state.storeGuid !== storeGuid


export default async (req, res, initialState: Partial<SSESessionState>) => {
    const session = await createSession<Partial<SSESessionState>>(req, res)
    session.state = initialState

    getSSEAllSesionsChannel().register(session)
    const channelAll = getSSEAllSesionsChannel()
    console.log('\t\t', 'now sessions are', channelAll.activeSessions.length)
    return session
}
