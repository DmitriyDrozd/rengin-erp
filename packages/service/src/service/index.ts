import configureServiceStore from '../store/configureServiceStore'
import {serviceSaga} from './serviceSaga';
import getGServices from '../rest/settings/getGServices';
import path from 'path';


export default async () => {
    console.log('ENV', process.env)
    const gServices = await getGServices(path.join(__dirname,'..','rest','settings','stroi-monitroing-1590ca45292b.json'))
    const store = await configureServiceStore(gServices)

    global.store = store

    global.ducks = {}

    store.runSaga(serviceSaga, store.options)

    return store
}



