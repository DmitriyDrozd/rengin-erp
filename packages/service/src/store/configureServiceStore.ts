import {applyMiddleware, createStore, Store} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {serviceDuck, SEServiceState} from './serviceDuck'

import {generateEventGuid} from '@sha/random'
import * as FSA from '@sha/fsa'
import sagaOptions, {SagaOptions} from '../sagaOptions';
import createMongoConnection from '../repositories/createMongoConnection';
import getServiceEnv from '../getServiceEnv';
import {GServices} from '../rest/settings/getGServices';
import eventStore from '../repositories/eventStore'

//var remotedev = require('remotedev-server');
//remotedev({ hostname: 'localhost', port: 8000 });
const appliedGuids = []
let instance: ServiceStore

export const getStore = () =>
    instance;

const configureServiceStore = async (gServices: GServices) => {
    const sagaMiddleware = createSagaMiddleware()


    //  const composeEnhancers = composeWithDevTools({ realtime: true, port: 8099, suppressConnectErrors:true });
    const middlewareEnhancer = applyMiddleware(sagaMiddleware)//composeEnhancers()
    let store = createStore(
        serviceDuck.reducer,

        middlewareEnhancer
    )
    const mongoURL = getServiceEnv().RENGIN_SERVICE_MONGO_URI
    const mongo = (await createMongoConnection({uri: mongoURL})).connection

    const EventsRepo = await eventStore(mongo)
    const nativeDispatch = store.dispatch

    const reduxDispatch = (e: any) =>
        nativeDispatch(e)

    const applyEvent = action => {
        if (action && action.meta && action.meta.persistent && !action.meta.replay) {
            console.log('SAVE EVENT TO STORE', action)
            eventStore(action)
        }
        reduxDispatch(action)
    }

    const dispatch = (action, extra?: { userId?: string, parentGuid?: string }) => {
        /*
        if( action && action.meta) {
            action.meta.persistent = false
        }
        */
        action = {...action}
        if (!action.guid)
            action.guid = generateEventGuid()
        if (!action.storeGuid) {
            action.storeGuid = 'service'
        }
        if (!action.timestamp)
            action.timestamp = new Date().toISOString()

        if (!appliedGuids.includes(action.guid)) {
            if (action.payload && action.payload.userId) {
                action.userId = action.payload.userId
            }

            persist(action)
            appliedGuids.push(action.guid)
        }

        return action
    }

    const persist = action => {
         if(!action.type.endsWith('reset') && !action.type.startsWith('sessions') && !action.meta.replay)
             EventsRepo.create(action)
        reduxDispatch(action)
    }

    const command = action => {
        if (action && action.meta) {
            action.meta.persistent = true
        }

        applyEvent(action)
    }

    const storeWithRun: any = {
        ...store,
        dispatch,
        runSaga: sagaMiddleware.run,

        persist,
        options: {} as any,
        command
    }
    const options = await sagaOptions(storeWithRun, mongo,gServices)
    storeWithRun.options = options

    return storeWithRun
}

type ThenArg<T> = T extends Promise<infer U> ? U :
    T extends ((...args: any[]) => Promise<infer V>) ? V :
        T

export type ServiceStore =
    Store<SEServiceState>
    & { options: SagaOptions, waitForAction: (pred: (val: any) => boolean) => FSA.FactoryAction<any> }

export default configureServiceStore

