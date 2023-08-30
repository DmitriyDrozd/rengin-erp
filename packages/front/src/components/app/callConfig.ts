import OutsideCallConsumer, { createCaller } from 'react-outside-call';
import {useTable} from '@blinkdb/react'


export const callConfig = createCaller({
    useEventsTable: () => useTable((model: Mo)),
    useToasts: () => useToasts(),
    apolloClient: () => useApolloClient(),
});