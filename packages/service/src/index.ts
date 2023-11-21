import './fastify-with-plugins'
import service from './service/index'


console.time('startup')
service()
  .catch(e => console.error('Service Error', e))
  .then(() => console.timeEnd('startup'))

process.on('unhandledRejection', r => {
    console.error('Unhandled Rejection', r)
})

process.on('uncaughtException', r => {
    console.error('Unhandled error', r)
})
 