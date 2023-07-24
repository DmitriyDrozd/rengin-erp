
import {AnyAction} from 'redux'
import {equals} from 'ramda'
import {generateGuid} from "@sha/random";

export * from './ExtractAction'

export const factoryDelimeter = '/'


export type DefaultMeta = {
  source?: string
  persistent?: boolean
  rebroadcast?: boolean
  aggregator?: string
  userId?: string
  isBatch?: boolean
  callerGUID?: string
}

export interface FactoryAction<P> {
  type: string
  payload: P
  error?: boolean
  timestamp?: number
  meta?: DefaultMeta
  guid: string
  sourceGuid?: string
  parentGuid?: string
  storeGuid?: string
  userId?: string
  isCommand?: boolean
}

export const getActionInfo = (action: FactoryAnyAction) =>
    `ACTION ${action.type} ${action.guid} by user ${(action.userId || 'guest')}`

export type FactoryAnyAction = FactoryAction<any>

export type ActionSelector<P> = (
    action: FactoryAction<P>,
) => action is FactoryAction<P>

export type IConsumer<I, A, O = I> = (state: I, action: A) => O

export const reducerFactory = <I, P, O>(
    reducer: IConsumer<I, FactoryAction<P>, O>,
) => (selector: ActionSelector<P>) => (state: I, action: FactoryAction<P>): O =>
    selector(action) ? reducer(state, action) : ((state as any) as O)

export interface Success<P, S> {
  params?: P
  result: S
}

export interface Failure<P, E = string[]> {
  params?: P
  error: E
}

export const isType = <P>(
    actionCreator: ActionCreator<P> | EmptyActionCreator,
) => {


  return () => (action: FactoryAnyAction): action is FactoryAction<P> =>
      action.type === actionCreator['type']
}

export const isTypeOfAny = <P>(actionCreator: Array<ActionCreator<P>>) => (
    action: FactoryAnyAction,
): action is FactoryAction<P> =>
    actionCreator.some(creator => creator.type === action.type)

export const isHasCreatorFactory = (
    acf: any,
): acf is { factory: ActionCreatorFactory } => acf && acf['factory']

export const isNamespace = (
    actionFactory: ActionCreatorFactory | { factory: ActionCreatorFactory },
) => (action: FactoryAnyAction) =>
    isHasCreatorFactory(actionFactory)
        ? action.type.startsWith(actionFactory.factory.base)
        : action.type.startsWith(actionFactory.base)

export interface ActionCreator<P> {
  type: string
  isType: (action: any) => action is FactoryAction<P>
  example: FactoryAction<P>
  handler: (payload: P) => any
  payloadReducer: ReducerBuilder<P, P>
  payloadReducerWithInitialState: (initial: Partial<P>) => ReducerBuilder<P, P>
  reduce: <I, A, O>(reducer: IConsumer<I, A, O>) => IConsumer<I, A, O>

  (payload: P, meta?: any | null, obj?: null | { userId?: string }): FactoryAction<P>
}

export type EmptyActionCreator = (
    payload?: undefined,
    meta?: any | null,
) => ActionCreator<undefined>

export const asyncStatuses = ['started', 'done', 'failed', 'unset'] as const
export type AsyncStatus = typeof asyncStatuses[number] // 'started' | 'done' | 'failed' | 'unset'

export type WithStatus<K extends string = 'asyncStatus'> = {
  [key in K]: AsyncStatus
}

export type UnsetAction =  {
  type: string
  payload: undefined
}

export type AsyncAction<P, S, E> =  FactoryAction<P> | FactoryAction<Success<P, S>> | FactoryAction<Failure<P, E>> | UnsetAction

export type AsyncActionCreators<P, S, E = string[]> = {
  type: string
  unset: EmptyActionCreator
  triggered: ActionCreator<P>
  started: ActionCreator<P>
  done: ActionCreator<Success<P, S>>
  failed: ActionCreator<Failure<P, E>>
  defaultState: AsyncState<S, P, E>
  asyncReducer: ReducerBuilder<AsyncState<S, P, E>, AsyncState<S, P, E>>
  isTypeOfAsync: (action: AnyAction) => action is  AsyncAction<P, S, E>
}


export interface EmptySuccess<S> {
  result: S
}

export interface EmptyFailure<E> {
  error: E
}

export interface EmptyAsyncActionCreators<S, E> {
  type: string
  unset: EmptyActionCreator
  started: EmptyActionCreator
  triggered: EmptyActionCreator
  done: ActionCreator<EmptySuccess<S>>
  failed: ActionCreator<EmptyFailure<E>>
}

export interface ActionCreatorFactory {
  base: string
  isNamespace: (action: FactoryAnyAction) => boolean

  (type: string, commonMeta?: any, error?: boolean): EmptyActionCreator

  <P>(
      type: string,
      commonMeta?: any,
      isError?: (payload: P) => boolean | boolean,
  ): ActionCreator<P>

  async<P, S = undefined>(type: string, commonMeta?: any): AsyncActionCreators<P, S, any>

  async<undefined, S, E>(
      type: string,
      commonMeta?: any,
  ): EmptyAsyncActionCreators<S, E>

  async<P, S, E>(type: string, commonMeta?: any): AsyncActionCreators<P, S, E>


}

declare const process: {
  env: {
    NODE_ENV?: string
  }
}

export type AsyncState<S, P = undefined, E = string> = {
  status: AsyncStatus | undefined
  params: P | undefined
  result: S | undefined
  error: E | undefined
}

export function actionCreatorFactory(
    prefix?: string | null,
    factoryMeta: {} = {},
    defaultIsError = (p: any) => p instanceof Error,
): ActionCreatorFactory {
  const actionTypes: { [type: string]: boolean } = {}

  const base = prefix ? `${prefix}${factoryDelimeter}` : ''

  function actionCreator<P = undefined>(
      type: string,
      commonMeta?: {} | null,
      isError: ((payload: P) => boolean) | boolean = defaultIsError,
  ): ActionCreator<P> {

    const fullType = base + type

    const creator = Object.assign(
        (payload: P, meta?: {} | null, obj?: { userId?: string } | null) => {
          const action: FactoryAction<P> = {
            type: fullType,
            guid: 'E-'+generateGuid(),
            ...obj,
            // timestamp: now(),
            payload,
          }

          if (commonMeta || meta || factoryMeta)
            action.meta = Object.assign(factoryMeta, commonMeta, meta)

          if (isError && (typeof isError === 'boolean' || isError(payload)))
            action.error = true

          return action
        },
        {
          reduce: <I, O = I>(
              f: IConsumer<I, FactoryAction<P>, O>,
          ): IConsumer<I, FactoryAction<P>, O> => f,
          type: fullType,
          base,
        },
    )

    const reduce = <I, O>(reducer: IConsumer<I, FactoryAction<P>, O>) =>
        // @ts-ignore
        reducerFactory(reducer)(isType((creator as any) as ActionCreator<P>))

    const isType = (action: any) => action.type && action.type === fullType

    const matchPayload = (payload: Partial<P>) => (action: FactoryAction<any>): action is FactoryAction<P> =>
        action.type === fullType && (
            equals(payload, action.payload) || (
                action.payload instanceof Object &&
                payload instanceof Object &&
                Object.keys(payload).every( key => payload[key] === action.payload[key])
            )
        )

    const handler = (payload: P): any => ({})

    const result = Object.assign(
        creator,
        {example: ({} as any) as FactoryAction<P>},
        {
          reduce,
          handler,
          isType,
          matchPayload,
          payloadReducerWithInitialState: initial =>
              (state = initial, action: any) => {
                return isType(action) ? action.payload : state
              },
          payloadReducer: (_ = '', action: any) => {
            return isType(action) ? action.payload : _
          },
        },
    )

    return (result as any) as ActionCreator<P>
  }

  function asyncActionCreators<P, S, E>(
      type: string,
      commonMeta?: {} | null,
  ): AsyncActionCreators<P, S, E> {
    const triggered = actionCreator<P>(`${type}_TRIGGERED`, commonMeta, false)
    const started = actionCreator<P>(`${type}_STARTED`, commonMeta, false)
    const done = actionCreator<Success<P, S>>(
        `${type}_DONE`,
        commonMeta,
        false,
    )
    const failed = actionCreator<Failure<P, E>>(
        `${type}_FAILED`,
        commonMeta,
        true,
    )
    const unset = (actionCreator(
        `${type}_EMPTY`,
        commonMeta,
        false,
    ) as any) as EmptyActionCreator


    const defaultState: AsyncState<S, P, E> = {
      result: undefined as any as S,
      error: undefined as any as E,
      status: 'unset',
      params: {} as any as P,
    }

    const isTypeOfAsync = (action: AnyAction) : action is AsyncAction<P, S, E> =>
        action.type.startsWith(base + type)

    return {
      isTypeOfAsync,
      type: base + type,
      started,
      triggered,
      // @ts-ignore Ha-ha-ha
      defaultState,
      done,
      failed,
      unset,
      // @ts-ignore
      asyncReducer: reducerWithInitialState((defaultState))
          .case(started, (state, payload) => ({
            ...state,
            result: undefined,
            error: undefined,
            status: 'started',
            params: payload,
          }))
          .case(done, (state, payload) => {
            return {
              ...state,
              result: payload.result,
              error: undefined,
              status: 'done',
              params: payload.params,
            }
          })
          // @ts-ignore
          .case(failed, (state, payload) => ({
            ...state,
            result: undefined,
            error: payload.error,
            status: 'failed',
            params: payload.params,
          }))
          // @ts-ignore
          .case(unset, _ => ({
            ..._,
            result: undefined,
            error: undefined,
            status: 'unset',
            params: undefined,
          })),
    }
  }

  return (Object.assign(actionCreator, {
    async: asyncActionCreators,
    base,
    isNamespace: (action: FactoryAnyAction): boolean =>
        action.type && action.type.startsWith(prefix)
  }) as any) as ActionCreatorFactory
}


export interface ReducerBuilder<InS extends OutS, OutS = InS> {
  case<P>(
      actionCreator: ActionCreator<P>,
      handler: Handler<InS, OutS, P>,
  ): ReducerBuilder<InS, OutS>

  caseWithAction<P>(
      actionCreator: ActionCreator<P>,
      handler: Handler<InS, OutS, FactoryAction<P>>,
  ): ReducerBuilder<InS, OutS>

  // cases variadic overloads
  cases<P1>(
      actionCreators: [ActionCreator<P1>],
      handler: Handler<InS, OutS, P1>,
  ): ReducerBuilder<InS, OutS>

  cases<P1, P2>(
      actionCreators: [ActionCreator<P1>, ActionCreator<P2>],
      handler: Handler<InS, OutS, P1 | P2>,
  ): ReducerBuilder<InS, OutS>

  cases<P1, P2, P3>(
      actionCreators: [
        ActionCreator<P1>,
        ActionCreator<P2>,
        ActionCreator<P3>
      ],
      handler: Handler<InS, OutS, P1 | P2 | P3>,
  ): ReducerBuilder<InS, OutS>

  cases<P1, P2, P3, P4>(
      actionCreators: [
        ActionCreator<P1>,
        ActionCreator<P2>,
        ActionCreator<P3>,
        ActionCreator<P4>
      ],
      handler: Handler<InS, OutS, P1 | P2 | P3 | P4>,
  ): ReducerBuilder<InS, OutS>

  cases<P>(
      actionCreators: Array<ActionCreator<P>>,
      handler: Handler<InS, OutS, P>,
  ): ReducerBuilder<InS, OutS>

  // casesWithAction variadic overloads
  casesWithAction<P1>(
      actionCreators: [ActionCreator<P1>],
      handler: Handler<InS, OutS, FactoryAction<P1>>,
  ): ReducerBuilder<InS, OutS>

  casesWithAction<P1, P2>(
      actionCreators: [ActionCreator<P1>, ActionCreator<P2>],
      handler: Handler<InS, OutS, FactoryAction<P1 | P2>>,
  ): ReducerBuilder<InS, OutS>

  casesWithAction<P1, P2, P3>(
      actionCreators: [
        ActionCreator<P1>,
        ActionCreator<P2>,
        ActionCreator<P3>
      ],
      handler: Handler<InS, OutS, FactoryAction<P1 | P2 | P3>>,
  ): ReducerBuilder<InS, OutS>

  casesWithAction<P1, P2, P3, P4>(
      actionCreators: [
        ActionCreator<P1>,
        ActionCreator<P2>,
        ActionCreator<P3>,
        ActionCreator<P4>
      ],
      handler: Handler<InS, OutS, FactoryAction<P1 | P2 | P3 | P4>>,
  ): ReducerBuilder<InS, OutS>

  casesWithAction<P>(
      actionCreators: Array<ActionCreator<P>>,
      handler: Handler<InS, OutS, FactoryAction<P>>,
  ): ReducerBuilder<InS, OutS>

  withHandling(
      updateBuilder: (
          builder: ReducerBuilder<InS, OutS>,
      ) => ReducerBuilder<InS, OutS>,
  ): ReducerBuilder<InS, OutS>

  // Intentionally avoid AnyAction in return type so packages can export reducers
  // created using .default() or .build() without requiring a dependency on typescript-fsa.
  default(
      defaultHandler: Handler<InS, OutS, FactoryAnyAction>,
  ): (state: InS | undefined, action: { type: any }) => OutS

  build(): (state: InS | undefined, action: { type: any }) => OutS

  (state: InS | undefined, action: FactoryAnyAction): OutS
}

export type Handler<InS extends OutS, OutS, P> = (
    state: InS,
    payload: P,
) => OutS

export function reducerWithInitialState<S>(initialState: S): ReducerBuilder<S> {
  return makeReducer<S, S>(initialState)
}

export function reducerWithoutInitialState<S>(): ReducerBuilder<S> {
  return makeReducer<S, S>()
}

export function upcastingReducer<InS extends OutS, OutS>(): ReducerBuilder<InS,
    OutS> {
  return makeReducer<InS, OutS>()
}

function makeReducer<InS extends OutS, OutS>(
    initialState?: InS,
): ReducerBuilder<InS, OutS> {
  const handlersByActionType: {
    [actionType: string]: Handler<InS, OutS, any>
  } = {}
  const reducer = getReducerFunction(
      initialState,
      handlersByActionType,
  ) as ReducerBuilder<InS, OutS>

  reducer.caseWithAction = <P>(
      actionCreator: ActionCreator<P>,
      handler: Handler<InS, OutS, FactoryAction<P>>,
  ) => {
    handlersByActionType[actionCreator.type] = handler
    return reducer
  }
  // @ts-ignore
  reducer.case = <P>(
      actionCreator: ActionCreator<P>,
      handler: Handler<InS, OutS, FactoryAction<P>>,
  ) =>
      reducer.caseWithAction(actionCreator, (state, action) =>
          // @ts-ignore
          handler(state, action.payload),
      )

  reducer.casesWithAction = <P>(
      actionCreators: Array<ActionCreator<P>>,
      handler: Handler<InS, OutS, FactoryAction<P>>,
  ) => {
    for (const actionCreator of actionCreators) {
      reducer.caseWithAction(actionCreator, handler)
    }
    return reducer
  }

  reducer.cases = <P>(
      actionCreators: Array<ActionCreator<P>>,
      handler: Handler<InS, OutS, P>,
  ) =>
      reducer.casesWithAction(actionCreators, (state, action) =>
          handler(state, action.payload),
      )

  reducer.withHandling = (
      updateBuilder: (
          builder: ReducerBuilder<InS, OutS>,
      ) => ReducerBuilder<InS, OutS>,
  ) => updateBuilder(reducer)

  reducer.default = (defaultHandler: Handler<InS, OutS, FactoryAnyAction>) =>
      getReducerFunction(
          initialState,
          {...handlersByActionType},
          defaultHandler,
      )

  reducer.build = () =>
      getReducerFunction(initialState, {...handlersByActionType})

  return reducer
}

function getReducerFunction<InS extends OutS, OutS>(
    initialState: InS | undefined,
    handlersByActionType: { [actionType: string]: Handler<InS, OutS, any> },
    defaultHandler?: Handler<InS, OutS, FactoryAnyAction>,
) {
  return (state = initialState, action: FactoryAnyAction) => {
    const handler = handlersByActionType[action.type] || defaultHandler
    return handler ? handler(state, action) : state
  }
}
