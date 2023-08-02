import {call, delay, fork, put, select, take, takeLatest} from 'typed-redux-saga'


import {metaDuck} from 'iso/src/store/metaDuck'
import {adminNotifySaga} from './adminOverlayNotifySaga'
import {generateGuid} from '@sha/random/src'
import {uiDuck} from '../store/ducks/uiDuck'
import sseClientSaga from 'iso/src/store/sse/sseClientSaga'
import getRestApi from 'iso/src/getRestApi'
import {History} from 'history'
import {sleep} from '@sha/utils'
import {selectCurrentUser} from '../store/frontReducer'
import {Bootstrap, bootstrapDuck, bootstrapDucksMap} from 'iso/src/store/bootstrapDuck';
import {connectionDuck} from 'iso/src/store'
import {SSEClientFront} from 'iso/src/store/sse/SSEClientFront'
import {appStorage} from 'iso'
import {Preferences, preferencesDuck} from '../store/ducks/preferencesDuck'
import {nav} from '../components/nav'
import {UserVO} from 'iso/src/store/bootstrap/repos/user-schema'
import disposeGlobalPreloader from '../utils/disposeGlobalPreloader'

const getURLCreds = () => {
    const params = Object.fromEntries(new URLSearchParams(window.location.search))
    if(params.password && params.email)
        return {
            password: params.password,
            email: params.email,
            remember: true,
            pathname: window.location.pathname
        }

    return undefined
}
export function* loginSaga(history: History) {

    const api = yield* call(getRestApi)
    window['restApi'] = api

    while (true) {
        const pathname = history.location.pathname

        const credentials =getURLCreds() || appStorage.getItem('credentials')

        if (!pathname || pathname == '/') {
            yield* call(sleep, 200)
        }
        let path = window.location.pathname

        if (path.endsWith('/login') || path.length < 2) {
            yield* put(uiDuck.actions.preloaded(undefined))
            history.replace(nav.login())
            appStorage.removeItem('credentials')
        } else if (credentials) {
            yield* fork(function* autoLogin() {
                yield* call(delay, 100)
                yield* put(uiDuck.actions.loginRequested({...credentials}))
            })
        } else {
            history.replace(nav.login())
            yield* put(uiDuck.actions.preloaded(undefined))
            appStorage.removeItem('credentials')
        }

        let result = {bootstrap: {} as any as Bootstrap}
        while (true) {
            try {
                const loginAction = yield* take(uiDuck.actions.loginRequested.isType)
                const {email, password} = loginAction.payload
                result = yield* call(api.fetchBootstrap, {email, password})
                yield* put(uiDuck.actions.loggedIn({email, password}))

                yield* put(bootstrapDuck.actions.fetchBootstrap.done(result))
                const resetDucksActions = Object.entries(bootstrapDucksMap).map(([k,v]) =>
                    v.actions.reset(result.bootstrap[k] as any)
                )
                for (const action of resetDucksActions)
                    yield* put(action)

                const currentUser = result.bootstrap.users.find(u => u.email === email)

                yield* put(uiDuck.actions.setLogin(email))
                const preferences: Preferences = yield* select(preferencesDuck.selectPreferences)
                const preferenceRoleId = preferences.role
                console.log('login result', result)

                break
            } catch (e) {
                console.error(e)
                appStorage.removeItem('credentials')
                yield* put(uiDuck.actions.unbusy('Login'))
                yield* put(uiDuck.actions.preloaded(undefined))


                if (!window.location.pathname.startsWith('/app/login')) {
                    history.replace(nav.login())
               /*     const actionNavToLogin = routerDuck.actions.replacePage({url: nav.login()})

                    yield* put(actionNavToLogin)*/
                }
            }
        }


        ///  yield* fork(bootstrapSetupSaga)

        yield* put(uiDuck.actions.busy('fetchAdminState'))
        yield* put(uiDuck.actions.unbusy('Login'))
        yield* fork(adminNotifySaga)
        const user: UserVO = yield* select(selectCurrentUser)


        yield* takeLatest(uiDuck.actions.setRole.isType, function* (action) {
            yield* put(preferencesDuck.actions.setKey({key:'roleId', value: action.payload}))
        })
        yield* fork(sseClientSaga)
        const meta = {userId: user.userId, storeGuid: 'S' + generateGuid()}
        yield* put(connectionDuck.actions.gatewayChanged(SSEClientFront.getSSERoute(meta)))
        yield* put(metaDuck.actions.metaUpdated(meta))
        yield* put(uiDuck.actions.unbusy('fetchAdminState'))


        //const ypState =  mockState

        //  const boot = yield* call(api.fetchBootstrap)//


        if (window.location.pathname === '/app/login') {
            history.push(nav.usersList())
        }


        // yield* delay(600)
        //yield* put(configDuck.actions.ozonRefetchIntervalChanged(1))
        yield* put(uiDuck.actions.preloaded(undefined))

        disposeGlobalPreloader()
        yield* put(uiDuck.actions.unbusy('Login'))
        const action = yield* take(uiDuck.actions.logout.isType)


        yield* call(sleep, 100)
        yield* put(uiDuck.actions.loggedOut(undefined))
        yield* put(uiDuck.actions.setLogin(''))
        appStorage.removeItem('credentials')

        //yield* put(usersCRUD.actions.reset([]))
        // yield* put(projectsCURD.actions.reset([]))


    }
    // yield* call(sceneSaga_ex, document.getElementById('scene'),'/models/model.wsmdl')


}



