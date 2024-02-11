import {NODE_ENV, NodeEnvValue} from "./environment";
import {EmptyObject} from "./types";

export type EnvConfigVarValue=string|number|boolean
export type EnvConfig<T extends Record<string, EnvConfigVarValue> = EmptyObject> = {
    [k in NodeEnvValue]: T
}

const emptyEnvConfig: EnvConfig = {
    local:{},
    development: {},
    production:{}
}
let _envCfg = emptyEnvConfig
export const envConfig = <T extends {[s in string]: string|number|boolean} = {[s in string]: string|number|boolean}>(envCfg: EnvConfig<T> = _envCfg as any as EnvConfig<T>) => {
    _envCfg = envCfg
    const currentEnv = envCfg[NODE_ENV as any as keyof EnvConfig<T> ] as any as T
    return {
        addVar: <S extends string, V extends EnvConfigVarValue>(name: S, {development,local,production}: {
            [k in NodeEnvValue]: EnvConfigVarValue
        })  => {
            return envConfig({
                local: {...envCfg.local, [name]: local},

                development: {...envCfg.development, [name]: development},
                production: {...envCfg.production, [name]: production}
             })
        },
        getVar: <N extends keyof T & string>(name: N) => {
            if(currentEnv[name] === undefined)
                throw new Error('EnvVar '+ name + ' is not definedS')
          return currentEnv[name]
        },
        getString: <N extends keyof T & string>(name: N) => {
            if(currentEnv[name] === undefined)
                throw new Error('EnvVar '+ name + ' is not definedS')
            return String(currentEnv[name])
        },
        getBoolean: <N extends keyof T & string>(name: N) => {
            if(currentEnv[name] === undefined)
                throw new Error('EnvVar '+ name + ' is not definedS')
            return Boolean(currentEnv[name])
        },
        ...currentEnv
    }
}

