import configureServiceStore from '../store/configureServiceStore'
import {serviceSaga} from './serviceSaga';
import getGServices from '../rest/settings/getGServices';
import * as path from 'path';


export default async () => {
    console.log('ENV', process.env)


    const store = await configureServiceStore()

    global.store = store

    global.ducks = {}

    store.runSaga(serviceSaga, store.options)

    return store
}



