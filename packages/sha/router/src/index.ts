import {match, matchPath,} from 'react-router'
import * as CRR from 'connected-react-router'

import {createBrowserHistory, createMemoryHistory, LocationDescriptorObject} from 'history'
import {isBrowser} from '@sha/utils'
import {ActionCreator, FactoryAnyAction} from '@sha/fsa'
import {call, put, select, takeLatest} from 'typed-redux-saga'
import {useSelector} from 'react-redux';
import {routerDuck} from 'front/src/store/ducks/routerDuck';


export * from 'react-router'
const {connectRouter, routerMiddleware, ConnectedRouter,LOCATION_CHANGE} = CRR
export  {connectRouter, routerMiddleware, ConnectedRouter}


export const history = isBrowser()
    ? createBrowserHistory()
    : createMemoryHistory()


export type RouterHistory = typeof history


export const useLatestNavLocation = <P extends string, N extends NavRoute<P>>(nav: NavRoute<P>): (CRR.RouterLocation<any> & {params: ExtractRouteParams<P>}) | undefined => {
    const router = useSelector(routerDuck.selectRouter)
    const loc = router.history.reverse().find(l => nav.match(l.pathname, {isExact:true}))
    const params = nav.match(loc.pathname, {isExact: true}) //|| {}
    return loc ? {...loc, params:params?params.params:undefined} : undefined
}

export const NO_NAV_MATCH = {}

export const useLatestNavParams = <P extends string, N extends NavRoute<P>>(nav: NavRoute<P>): ExtractRouteParams<P> => {
    const router = useSelector(routerDuck.selectRouter)
    const loc = router.history.reverse().find(l => nav.match(l.pathname, {isExact:false}))
    if(!loc)
        return NO_NAV_MATCH as any as  ExtractRouteParams<P>
    const params = nav.match(loc.pathname, {isExact: false}) //|| {}
    return params ? params.params : NO_NAV_MATCH as any as  ExtractRouteParams<P>
}

export const getBrowserHistory = () => history

export type ExtractRouteParams<RoutePath extends string> =
    RoutePath extends `${string} ${infer Path}`
        ?  ExtractRouteParams<Path>
        :   RoutePath extends `${string}/:${infer Param}/${infer Rest}`
            ? {
                [Entry in Param | keyof ExtractRouteParams<`/${Rest}`>]: string;
            }
            : RoutePath extends `${string}/:${infer Param}`
                ? {
                    [Entry in Param]: string;
                }
                : never


type LeanRouteBuilder<Pattern extends string,RouteParams = ExtractRouteParams<Pattern>> =  (pattern: Pattern) =>
    (params: RouteParams) => Pattern

type GetRouteBuilder<
  F extends LeanRouteBuilder<Pattern,RouteParams>, Pattern extends string, RouteParams = ExtractRouteParams<Pattern>
> = F


const emptyLocationState = {}
export type EmptyState = typeof emptyLocationState


export type RoutePath = string

export type LocationArgs< P, S> = LocationDescriptorObject<S> & {params?: ExtractRouteParams<P>}
const routeBuilder = <
    Pattern extends RoutePath,
    LocationState = EmptyState,
    RouteParams extends {[k in string]: string}= ExtractRouteParams<Pattern>,
    >
(pattern: Pattern) => {

  const builder =( (params: RouteParams, query = {}) => {
          let pathname = Object.entries(params || {}).reduce(
              (url, [k, v]) =>
                  url.replace(':' + k, String(v)),
              pattern
          )
          const keys = Object.keys(query)
          if(keys.length) {
              pathname+='?' + (new URLSearchParams(query).toString())
          }

          return pathname
      }
  )as any as (
          RouteParams extends never
              ? () => Pattern
              : (params: RouteParams) => Pattern
      )


  const matchParams = (path: string, options: match<RouteParams> = {isExact: true} as any as match<RouteParams>): match<RouteParams> | null => {
    const result = matchPath<RouteParams>(path, {
      path: pattern,
      ...options,
    })
    return result
  }

  return Object.assign(
    builder,
    {
      build: ({params, ...descriptor}: LocationArgs<Pattern, LocationState>): LocationDescriptorObject<LocationState> => {

          return {
              ...descriptor,
              //@ts-ignore
              pathname: params ? builder(params) : builder()
          }
      },

      match: matchParams,
      pattern,
      isSameLocationAction: (action: any, isExact: boolean = true): action is LocationAction<RouteParams> =>
        action.type.includes(LOCATION_CHANGE) &&
        action.payload &&
        action.payload.location &&
        action.payload.location.pathname &&
        action.payload.location.pathname !== null &&
        action.payload.location.pathname !== undefined &&
        matchParams(action.payload.location.pathname) &&
        (
          isExact ? matchParams(action.payload.location.pathname).isExact === true : true
        ),
    },
  )
}
type RouteBuilder = typeof routeBuilder
type UnaryFn<T, V> = (a: T) => V
type BinaryFn<T, C, V> = (a: T) => (b:C) => V
type FirstArg<F> = F extends UnaryFn<infer A, infer R> ? A : never
type SecondArg<F> = F extends BinaryFn<infer A, infer B, infer R> ? B : never
type GetRP<P extends string, RP = ExtractRouteParams<P>> =RP
export type NavRoute<P extends string, RP = ExtractRouteParams<P>, S extends any = {}> = (
    RP extends never
        ? {
            (params: RP): P
        }
        :{
            (): P
        }
)
        & {
    match: <O extends Object>(o:O,  options?: Partial<match<RP>>) => match<RP> | null,
    pattern: P,
    build: (agrs: LocationArgs<P, S>)=> LocationDescriptorObject<S>,

    isSameLocationAction: <AP, A extends LocationAction<AP>>(action: A, isExact:boolean) =>
        A extends LocationAction<RP>
            ? true
            : false

}


export type HistoryAction = any

export type LocationAction<T = undefined> = {
  type: string,
  payload: {
    location: {
      pathname: string
    }
    params: T
    recordToHistory?: boolean
    action: HistoryAction
  }
}

export const isLocationAction = <Path extends string>(route?: NavRoute<Path>, isExact = true) => (action: any): action is LocationAction<ExtractRouteParams<Path>> =>
  route
    ? route.isSameLocationAction(action, isExact)
    : action.type.includes(LOCATION_CHANGE)

export const isAnyLocationAction = (action: any): action is LocationAction<any> =>
    action.type.includes(LOCATION_CHANGE)


export const push = <Path extends string>(nav: NavRoute<Path>) => (params: ExtractRouteParams<Path>) =>
  CRR.push(nav(params))
/*({
  type: LOCATION_CHANGE,
  payload: {
    location: {
      pathname: route(params),
    },
    params,
    pattern: route.pattern,
    action: 'PUSH',
    // recordToHistory: true,
  },
})*/

export const replace =  <Path extends string>(nav: NavRoute<Path>) => (params: ExtractRouteParams<Path>) =>
    CRR.replace(nav(params))
    /*({
  type: LOCATION_CHANGE,
  payload: {
    location: {
      pathname: route(params),
    },
    params,
    pattern: route.pattern,
    action: 'REPLACE',
    // recordToHistory: true,
  },
})*/
export const pop = () => ({
  type: LOCATION_CHANGE,
  payload: {

    action: 'POP',
    // recordToHistory: true,
  },
})
export const pushPathname = <T>(pathname: string) => ({
  type: LOCATION_CHANGE,
  payload: {
    location: {
      pathname,
    },
    action: 'PUSH',
    // recordToHistory: true,
  },
})
export const replacePathname = <T>(pathname: string) => ({
    type: LOCATION_CHANGE,
    payload: {
        location: {
            pathname,
        },
        action: 'REPLACE',
        // recordToHistory: true,
    },
})
export {
  LOCATION_CHANGE, routeBuilder, CRR
}





export function* dispatchOnRouteSaga<Path extends string>(nav: NavRoute<Path>, actionCreatorToDispatch: ActionCreator<ExtractRouteParams<Path>>, isExact = false) {

  let lastMatched = false

  function* worker(action) {
    const params = nav.match(action.payload.location.pathname)!.params

    yield* put(actionCreatorToDispatch(params))
  }

  // @ts-ignore
  yield* takeLatest( (action: FactoryAnyAction) => {

      const result = isLocationAction(nav, isExact)(action)

      if (result && !lastMatched) {
        lastMatched = true
        return result
      }

      if (!result && lastMatched && action.type.includes(LOCATION_CHANGE))
        lastMatched = false

      return false
    },
    worker,
  )

}


export function* takeLatestRoute<Path extends string>(nav: NavRoute<Path>, worker: (payload?: ExtractRouteParams<Path>) => any) {
  let pathname = ''
  yield* takeLatest( (action: FactoryAnyAction) => {
        const result = isLocationAction(nav)(action)
        if (result && (action.payload.location.pathname !== pathname)) {
          pathname = action.payload.location.pathname
          return result
        }
        return false
      },
      function* (action) {
        pathname = yield* select((state: any) => state.router.location.pathname)
        const result = isLocationAction(nav)(action)
        if(result)
          yield* call(worker,action.payload)
      },
  )
}

