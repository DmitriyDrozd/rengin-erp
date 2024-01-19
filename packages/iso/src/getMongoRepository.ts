import {Connection, Document, Model, model, Schema} from 'mongoose';
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
let Model
 try {
        console.log('getMongoRepo', name)

     Model = model(name, schema) as any
 } catch (e) {
        console.log('Error second creation of '+name)
        console.error(e)
 }
 return Model
}
export default getMongoRepository
