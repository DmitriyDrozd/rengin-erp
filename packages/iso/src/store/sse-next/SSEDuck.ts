import * as FSA from '@sha/fsa'

type SSEStatus = 'IDLE' | 'CONNECTING' | 'OPEN' | 'CLOSED'
type SSEVO = {
    url
    status: SSEStatus
    eventTypes: string[]
    log: any[]
    error?: any
}

const sseDuck = FSA.createCRUDDuck(
    'sse',
    'url',
    {
        status: 'IDLE',
        eventTypes: [],
        log: [],
        url: undefined
    } as any as SSEVO)


const factory = sseDuck.factory

const actions = {
    ...factory,
}
