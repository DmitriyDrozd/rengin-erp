import {call} from "typed-redux-saga";

export default function* wrapPerformanceSaga<T, R, Fn extends (...args: T[]) => R>(f: Fn, ...params: T[]) {
    const start = new Date().getTime()

    const result = yield* call(f, ...params)
    const end = new Date().getTime()
    console.log(`${f.name} excetuted for ${end - start}`)
    return result
}
