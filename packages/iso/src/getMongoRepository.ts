import {Connection, Document, Model, Schema} from 'mongoose';
import {Extract} from 'ts-mongoose';

export const getMongoRepository = async <T extends Schema, S extends {
    [name: string]: Function;
}>(
    connectionPromise: Connection | Promise<Connection>,
    name: string,
    schema?: T,
    collection?: string,
    skipInit?: boolean,
    statics?: S & ThisType<Model<Document & Extract<T>>>
): Promise<Model<Document & Extract<T>> & S> => {
    const conn = await Promise.resolve(connectionPromise)
    if (schema && statics)
        schema.statics = statics;
    console.log('define model '+name)


    return conn.model(name, schema, collection) as any
}
export default getMongoRepository
