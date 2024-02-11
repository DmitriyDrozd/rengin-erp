import {identity} from 'ramda';

type Awaitable<T> = T | PromiseLike<T>

export  const isPromise = <T>(promise: Awaitable<T>): promise is PromiseLike<T> => {
    if(promise !== null && typeof promise === 'object' && typeof promise['then'] === 'function') {
        return true
    }
    return false
}

export const estimate = <T, A extends Array<E>, E>(
  test: (...args:A) => T,
  label?: string,
  logArgs: (...args:A) => any = identity as any
) =>
    (...args: A): T  => {
     const argsForLog = logArgs(...args)
      const displayLabel = label || 'estimate ' + label || test.name+', args '+[...argsForLog]
      console.log('ESTIMATE: call  '+label)
      console.time(displayLabel)

      const result = test(...args)



      console.timeEnd(displayLabel)
      return result
    }

export const estimateAsync = <T, A extends Array<E>, E>(
    test: (...args:A) => Promise<T>,
    label: string = 'someFunction',
) =>
   async (...args: A): Promise<T>  => {
      console.time('ESTIMATE: ' + label)

      const result = await test(...args)

      console.timeEnd('ESTIMATE: ' + label)
      return result
    }
