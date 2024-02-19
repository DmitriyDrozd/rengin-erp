import {envConfig} from "@shammasov/utils";
import './typings'
import {createMongoConnection} from "@shammasov/mydux-backend";
import getGServices from "./fastify/gapis-token/getGServices";
import path from "path";
import knex from "knex";
import configureServiceStore from "./store/buildServerStore";
import {orm} from "iso";
import {rootSaga} from "./store/rootSaga";

envConfig({
    "local": {
        "MONGO_URI": "mongodb://dev:BuildMeUp@dev.rengindesk.ru:37017/local_dev",
        POSTGRES_URI: 'postgres://root:BuildMeUp@dev.rengindesk.ru:35432/local_dev',
        WRITE_PG: false,
    },
    "development": {
        "MONGO_URI": "mongodb://dev:BuildMeUp@dev.rengindesk.ru:37017/dev",
        POSTGRES_URI: 'postgres://root:BuildMeUp@dev.rengindesk.ru:35432/dev',
        WRITE_PG: false,
    },
    "production": {
        "MONGO_URI": "mongodb://dev:BuildMeUp@rengindesk.ru:37017/prod",
        POSTGRES_URI: 'postgres://root:BuildMeUp@rengindesk.ru:35432/prod',
        WRITE_PG: false,
    }})
// you're best off initializing config ASAP in your program

async function main() {

    const mongo = (await createMongoConnection())
    const gServices = await getGServices(path.join(__dirname,'fastify','gapis-token','stroi-monitroing-1590ca45292b.json'))
    const connectionString =  envConfig().getString('POSTGRES_URI')
    const pg = knex({
        client: 'pg',
        connection: { connectionString, pool: {max:20, min:3,}}
    });

    const store = await configureServiceStore({mongo, pg, orm, gServices})
    store.run(rootSaga)

}
console.time('startup')
main()
  .catch(e => console.error('Service Error', e))
  .then(() => console.timeEnd('startup'))

process.on('unhandledRejection', r => {
    console.error('Unhandled Rejection', r)
})

process.on('uncaughtException', r => {
    console.error('Unhandled error', r)
})
