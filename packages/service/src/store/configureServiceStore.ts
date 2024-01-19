import {applyMiddleware, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {serviceDuck} from './serviceDuck'

import {generateEventGuid} from '@sha/random'
import sagaOptions from '../sagaOptions';
import getGServices from '../rest/settings/getGServices';
import eventStore from '../repositories/eventStore'
import knex, {Knex} from "knex";
import path from "path";
import {UnPromisify} from "@sha/utils";
import mongoose from 'mongoose'
import {config} from "@app-config/main";

//var remotedev = require('remotedev-server');
//remotedev({ hostname: 'localhost', port: 8000 });
const appliedGuids = []
let instance: ServiceStore

export const getStore = () =>
    instance;

const createMongoConnection = async () => {
    return await mongoose.connect(config.MONGO_URI,{})
}




const configureServiceStore = async () => {
    const sagaMiddleware = createSagaMiddleware()
    const gServices = await getGServices(path.join(__dirname,'..','rest','settings','stroi-monitroing-1590ca45292b.json'))

    //  const composeEnhancers = composeWithDevTools({ realtime: true, port: 8099, suppressConnectErrors:true });
    const middlewareEnhancer = applyMiddleware(sagaMiddleware)//composeEnhancers()
    let store = createStore(
        serviceDuck.reducer,

        middlewareEnhancer
    )

    const mongo = (await createMongoConnection()).connection

    const connectionString =  config.POSTGRES_URI
const pg = knex({
        client: 'pg',
        connection: { connectionString, pool: {max:20, min:3,}}
    });
    const EventsRepo = await eventStore(mongo)
    const nativeDispatch = store.dispatch

    const reduxDispatch = (e: any) =>
        nativeDispatch(e)

    const applyEvent = action => {
        if (action && action.meta && action.meta.persistent && !action.meta.replay) {
            console.log('SAVE EVENT TO STORE', action)
            EventsRepo.create(action)
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

    const storeWithRun = {
        ...store,
        dispatch,
        runSaga: sagaMiddleware.run,
        mongo, pg: pg as any as Knex, gServices,
        persist,
        options: {} as any,
        command
    }
    const options = await sagaOptions(storeWithRun, EventsRepo)
    storeWithRun.options = options

    return storeWithRun
}

type ThenArg<T> = T extends Promise<infer U> ? U :
    T extends ((...args: any[]) => Promise<infer V>) ? V :
        T

export type ServiceStore =
    UnPromisify<ReturnType<typeof configureServiceStore>>

export default configureServiceStore

