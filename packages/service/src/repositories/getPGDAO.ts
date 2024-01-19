import {clone, dissoc, project} from "ramda";
import {SagaOptions} from "../sagaOptions";
import {AnyFieldsMeta, ItemWithId, Resource} from "iso/src/store/bootstrap/core/createResource";


export const getPGDAO = async < RID extends string, Fields extends AnyFieldsMeta, T = ItemWithId<RID, Fields>>(io: SagaOptions, res: Resource<RID, Fields>) => {
    const tableName = res.factoryPrefix
    const idKey = res.idKey
    const tb = io.pg(tableName)
    const arrayProps = Object.values(res.properties).filter(p => p.type === 'array')
    const dissocArrays = (item: T) => {
        let r = item
        const keys = Object.keys(item)
        keys.forEach(k => {
            const prop = res.properties[k]
            if (!prop || prop.type === 'array')
                r = dissoc(k, r)
        })
        return r
    }

    const removeArrayPropsForItems = async (items: T[]) => {
        return await Promise.all(arrayProps.map( sub =>
             io.pg(tableName+'_'+sub.name).whereIn(res.idMeta.name, items.map(i => i[res.idKey])).delete()
         ))
    }

    const wrightArrayPropsForItems = async (items: T[]) => {
        const list = clone(items)
        return await Promise.all(arrayProps.map( sub => {
                list.forEach(i => {
                    if(i[sub.name] && i[sub.name].length)
                        i[sub.name].forEach(s => s[res.idKey] = i[res.idKey])
                })
               const parts =  list.filter(i => i[sub.name]).map(i => i[sub.name]).flat()
               const data =  project([...Object.keys(sub.properties),res.idKey], parts)
              if(data && data.length)
                  return  io.pg(tableName + '_' + sub.name).insert(data)
            return new Promise(resolve => resolve())
            }
        ))
    }

    const getById = async (itemId: string): Promise<T> => {
        const result =(await tb.select('*').where({[res.idKey] : itemId}))[0]
        return  result
    }
    const insertMany = async (items: T[]): Promise<any> => {
        const list = items.map(dissocArrays)
        const query = tb.insert(list).toQuery()
        const result =(await tb.insert(list))
        await wrightArrayPropsForItems(items)
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
        await removeArrayPropsForItems([item])
        const id = item[idKey]
        const props = dissoc(idKey, dissocArrays(item))
        const query = tb.where({ id: id}).update(props).toQuery()
        const result = (await tb.where({ [idKey]: id}).update(props))
        await wrightArrayPropsForItems([item])
        return  result
    }

    const removeById = async (id, hard = true): Promise<T> => {
        if (hard) {
            await removeArrayPropsForItems([{[idKey]: id}])
            const result = (await tb.where({ [idKey]: id}).delete())
            return  result
        }
        const result = (await tb.where({ [idKey]: id}).update({removed: true}))
        return  result

    }

    const create = async (item: T): Promise<T> => {
        await wrightArrayPropsForItems([item])
        const obj = dissocArrays(item)
        const res = await tb.insert(obj)
        return  res
    }
    const createMany = async (items: T[]): Promise<T[]> => {
        try {

            const list = items.map(dissocArrays)
           /* if(res.factoryPrefix==='issues') {
                for(let obj of list) {
                    console.log(obj.issueId)
                    try {
                         await tb.insert(obj)
                        await wrightArrayPropsForItems([obj])
                    }                   catch (e) {
                        console.error('PG ERROR insert into '+tableName, e, obj)

                    }
                }
                //console.log(duck.factoryPrefix + ' created', newItem)

            }else {*/
                const newItems = await tb.insert(list)
                await wrightArrayPropsForItems(items)
                //console.log(duck.factoryPrefix + ' created', newItem)
                return newItems
           // }
        } catch (e) {
            console.error('PG ERROR insert into '+tableName, e, items)
        }
    }

    const removeAll = async (): Promise<any> => {
        await tb.delete()
    }

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

