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

/*
import fetch from 'isomorphic-fetch'

const f = async () => await (await fetch('http://api.timezonedb.com/v2.1/get-time-zone?key=AB7YGONOQV0Y&format=json&by=position&lat=41.26465&lng=69.21627&time='+(new Date(2009,6,11)).getTime()/1000)).json()
f().then(r => {
    console.log(r)

    console.log(r.gmtOffset / 3600)
    debugger
})*/