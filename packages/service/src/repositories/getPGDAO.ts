import {dissoc} from "ramda";
import {Res} from 'iso/src/index'
import {dataform_v1beta1} from "googleapis";
import {SagaOptions} from "../sagaOptions";


export const getPGDAO = async <T,ID  extends keyof T, Tab extends string>(io: SagaOptions, res: Res) => {
    const tableName = res.factoryPrefix
    const idKey = res.idKey
    const tb = io.pg(tableName)

    const getById = async (itemId: string): Promise<T> => {
        const result =(await tb.select('*').where({[res.idKey] : itemId}))[0]
        return  result
    }
    const insertMany = async (items: T): Promise<any> => {
        const query = tb.insert(items).toQuery()
        const result =(await tb.insert(items))
        return  result
    }
    const getAll = async ({limit, condition} = {limit: undefined, condition: {}}): Promise<T[]> => {

        if(limit) {
            const result = (await tb.select('*').where(condition).orderBy('created_at','desc').limit(limit))
            return  result
        }
        const result = (await tb.select('*').where(condition).orderBy('created_at','desc'))
        return  result
    }

    const updateById = async (item: Partial<T>): Promise<T> => {
        const id = item[idKey]
        const props = dissoc(idKey, item)
        const query = tb.where({ id: id}).update(props).toQuery()
        const result = (await tb.where({ [idKey]: id}).update(props))
        return  result
    }

    const removeById = async (id, hard = true): Promise<T> => {
        if (hard) {
            const result = (await tb.where({ [idKey]: id}).delete())
            return  result
        }
        const result = (await tb.where({ [idKey]: id}).update({removed: true}))
        return  result

    }

    const create = async (item: T): Promise<T> => {
        const res = await tb.insert(item)
        return  res
    }
    const createMany = async (items: T[]): Promise<T[]> => {
        const newItems = await tb.insert(items)
        //console.log(duck.factoryPrefix + ' created', newItem)
        return newItems
    }

    const removeAll = async (): Promise<any> =>
        await tb.delete()


    return {

        getById,
        updateById,
        insertMany,
        create,
        getAll,
        removeAll,
        removeById,
        createMany,
        tableName,
        idKey
    }
}

