import getMongoRepository from 'iso/src/getMongoRepository'
import {Duck} from '@sha/fsa/createCRUDDuck'
import {Connection, Schema} from 'mongoose';
import {UnPromisify} from '@sha/utils';

const duckRepo = async <T, ID extends keyof T, S extends Schema>
({mongo}: { mongo: Connection }, duck: Duck<T, ID>, schema: S) => {
    const Model = await getMongoRepository(mongo, duck.factoryPrefix, schema)
    const idProp: ID = duck.idKey

    const getById = async (itemId: string): Promise<T> => {
        const condition = {[idProp]: itemId}
        return (await Model.findOne(condition).lean())
    }
    const insertMany = async (items: T): Promise<any> => {
        return (await Model.insertMany(items))
    }
    const upsertMany = async (items: T): Promise<any> => {

        return (await Model.updateMany(items))
    }

    const getAll = async ({limit, condition} = {limit: undefined, condition: {}}): Promise<T[]> => {

        const result = limit
            ? (await Model.find({...condition}).sort({_id: -1}).limit(limit).lean())
            : (await Model.find({...condition}).sort({_id: -1}).lean());

        return result
    }

    const updateById = async (item: T): Promise<T> => {
        const label = "CRUD "+ duck.factoryPrefix + ' update '+ item[idProp]
      const size = Math.floor(JSON.stringify(item).length / 1000)+ ' KB'
        var hrstart = process.hrtime()
        const result = await Model.findOneAndUpdate(
            {[idProp]: item[idProp]},
            item,
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }).lean()
        var hrend = process.hrtime(hrstart)
        console.info(`${label}\n${size}\n`+'Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
        return result
    }

    const removeById = async (id, hard = false): Promise<T> => {
        if (hard) {
            const result = await Model.deleteOne({[idProp]: id})

            return {}
        }
        const result = await Model.updateOne(
            {[idProp]: id},
            {removed: true},
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }).lean()

        return result
    }

    const create = async (item: T): Promise<T> => {
        const newItem = await Model.create({
            ...item,
        })
        //console.log(duck.factoryPrefix + ' created', newItem)
        return newItem
    }
    const createMany = async (items: T[]): Promise<T[]> => {
        const newItems = await Model.create(items)
        //console.log(duck.factoryPrefix + ' created', newItem)
        return newItems
    }

    const removeAll = async (): Promise<any> =>
        await Model.deleteMany({})


    return {
        duck,
        schema,
        getById,
        updateById,
        insertMany,
        create,
        getAll,
        removeAll,
        removeById,
        createMany,
        Model,
        idProp,
    }
}

export default duckRepo

export type DuckRepository<T, ID, S> = UnPromisify<ReturnType<typeof duckRepo>>
