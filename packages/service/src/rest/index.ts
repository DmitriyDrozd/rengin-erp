import configureServiceStore from '../store/configureServiceStore'
import {serverSaga} from './serverSaga';


export default async () => {
    const store = await configureServiceStore()

    // @ts-ignore
    global.store = store
    // @ts-ignore
    global.ducks = {}

    store.runSaga(serverSaga, store.options)

    return store
}



