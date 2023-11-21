import {applyMiddleware, createStore, Store} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {serviceDuck, SEServiceState} from './serviceDuck'

import {generateEventGuid} from '@sha/random'
import * as FSA from '@sha/fsa'
import sagaOptions, {SagaOptions} from '../sagaOptions';
import getGServices, {GServices} from '../rest/settings/getGServices';
import eventStore from '../repositories/eventStore'
import Env from "../Env";
import knex, {Knex} from "knex";
import path from "path";
import {UnPromisify} from "@sha/utils";

//var remotedev = require('remotedev-server');
//remotedev({ hostname: 'localhost', port: 8000 });
const appliedGuids = []
let instance: ServiceStore

export const getStore = () =>
    instance;

import mongoose from 'mongoose'

const createMongoConnection = async (config: { uri: string }) => {
    mongoose.set('strictQuery', true);
    return await mongoose.connect(config.uri, {
        //useNewUrlParser: true,
        pass: 'BuildMeUp',
        user: 'rengin',

        autoIndex: false,
    })
}

 type MongoConnection = ReturnType<typeof createMongoConnection>



const configureServiceStore = async () => {
    const sagaMiddleware = createSagaMiddleware()
    const gServices = await getGServices(path.join(__dirname,'..','rest','settings','stroi-monitroing-1590ca45292b.json'))

    //  const composeEnhancers = composeWithDevTools({ realtime: true, port: 8099, suppressConnectErrors:true });
    const middlewareEnhancer = applyMiddleware(sagaMiddleware)//composeEnhancers()
    let store = createStore(
        serviceDuck.reducer,

        middlewareEnhancer
    )
    const mongoURL = 'mongodb://dev.rengindesk.ru:27017/rengin'//Env.RENGIN_SERVICE_MONGO_URI
    //const mongoURL = ''Env.RENGIN_SERVICE_MONGO_URI
    const mongo = (await createMongoConnection({uri: mongoURL,})).connection

    const connectionString ="UserID=rengin;Password=BuildMeUp;Host=195.24.66.223;Port=5432;Database=rengin;Pooling=true;Min Pool Size=0;Max Pool Size=100;Connection Lifetime=0;"
//    Env.RENGIN_PG_CONNECTION_STRIN

    const pgConnectionConfig = {
         database:'rengin',
         host:'195.24.66.223',
         port:5432,
         user:'rengin',
         password: 'BuildMeUp'

    }
    const pg = knex({
        client: 'pg',
        connection: {...pgConnectionConfig, pool: 10}
    });
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

    const storeWithRun = {
        ...store,
        dispatch,
        runSaga: sagaMiddleware.run,
        mongo, pg: pg as any as Knex, gServices,
        persist,
        options: {} as any,
        command
    }
    const options = await sagaOptions(storeWithRun)
    storeWithRun.options = options

    return storeWithRun
}

type ThenArg<T> = T extends Promise<infer U> ? U :
    T extends ((...args: any[]) => Promise<infer V>) ? V :
        T

export type ServiceStore =
    UnPromisify<ReturnType<typeof configureServiceStore>>

export default configureServiceStore

