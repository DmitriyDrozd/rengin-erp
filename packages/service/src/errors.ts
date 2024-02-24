import type FastifyHttpErrorsEnhanced from 'fastify-http-errors-enhanced'

const _importDynamic = new Function("modulePath", "return import(modulePath)")
export let fastifyErrors: typeof FastifyHttpErrorsEnhanced
const preload = async () => {
    fastifyErrors  =  await _importDynamic('fastify-http-errors-enhanced')
    return fastifyErrors
}


export type FastifyErrors = Awaited<ReturnType<typeof preload>>
export let fastifyHttpErrorsPromise: Promise<FastifyErrors> = preload()


export let httpErrors: HttpErrors
const preloadHttpErrors = async () => {
    const lib =  await _importDynamic('http-errors-enhanced')
    httpErrors =  lib
    return lib
}


export type HttpErrors = Awaited<ReturnType<typeof preloadHttpErrors>>
export let httpErrorsPromise = preloadHttpErrors()
