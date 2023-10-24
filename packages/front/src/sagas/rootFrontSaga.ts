import {call, cancel, delay, fork, put, take} from 'typed-redux-saga';
import {uiDuck} from '../store/ducks/uiDuck';

import {loginSaga} from './loginSaga';
import {Store} from 'redux';
import {FrontState} from '../store/frontReducer';
import frontConfigDuck from '../store/ducks/frontConfigDuck';
import {routerSaga} from '../store/ducks/routerDuck';
import {preferencesSaga} from '../store/ducks/preferencesDuck';
import {logRocketSaga} from '../hooks/logRocketSaga'
import {nav, RouterHistory} from '../components/nav'
import {adminNotifySaga} from './adminOverlayNotifySaga'

//declare var GITVERSION: string
const VERSION = '0.3.8'//GITVERSION.split('\n')[0]
    //const LASTCOMMITDATETIME = GITVERSION//.split('\n')[1]
export default function* rootFrontSaga(store: Store<FrontState>, history: RouterHistory) {
    yield* fork(logRocketSaga)
    yield* fork(adminNotifySaga)
    yield* fork(routerSaga, history)
    yield* fork(preferencesSaga)


    const cfg = {}
    cfg['VERSION']= VERSION
 ///   cfg['LASTCOMMITDATETIME']= LASTCOMMITDATETIME

    yield* put(frontConfigDuck.actions.reset(cfg as any))


    while(true) {
        const task = yield* fork(loginSaga, history)
        const logoutActoin = yield* take(uiDuck.actions.logout.isType)

        yield* cancel(task)
        history.replace(nav.login({}))

        yield* call(delay, 100)

    }

}
