import * as FSA from './fsa'

export type BootableDuck<S,P extends string = any> = ReturnType<Clazz<S, P>['getDuck']>

export const createBootableDuck = <S, P extends string = string>(factoryPrefix: P,
                                                          defaultProps: S = {} as any,
                                                          defaultPersistent = true,
                                                          get = (state: any): S => state.app.bootstrap[factoryPrefix]
                                                          ) => {
    const factory = FSA.actionCreatorFactory(factoryPrefix, {persistent: defaultPersistent})
    const actions = {
        reset: factory<S>('reset', {persistent: false}),
    }
    const reducer = (state = defaultProps, action): S => {
        if (actions.reset.isType(action))
            return action.payload

        return state
    }
    return {
        ...factory,
        actions,
        select: get,
        reducer,
        factoryPrefix,
    }
}

class Clazz<S,P extends string = any>{
    public getDuck = (defaultItem:S)=> {
        return createBootableDuck('duck' as any as P, defaultItem)
    }
}


export default createBootableDuck
