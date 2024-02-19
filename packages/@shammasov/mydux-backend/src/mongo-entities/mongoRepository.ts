import mongoose, {model, Schema} from 'mongoose';
import {createSchema, Type} from 'ts-mongoose'


import {AnyAttr, AnyAttributes, EntitySlice, GenericEntitySlice} from "@shammasov/mydux";


const mongoRepository = async <S extends GenericEntitySlice> (duck: S) => {

  //  const schema = buildMongooseByResource(duck)
    const Model = getMongoModel(buildMongooseByResource(duck), duck.EID)
    type T = S['exampleItem']


    const getById = async (id: string): Promise<T | undefined> => {
        const condition = {id}
        const result = (await Model.findOne(condition).lean())
        return result ? result : undefined
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

        return result.map( ({_id, createdAt, updatedAt,...o}) => o)
    }

    const updateById = async (item: T): Promise<T> => {
        const label = "CRUD "+ duck.EID + ' update '+ item.id
      const size = Math.floor(JSON.stringify(item).length / 1000)+ ' KB'
        var hrstart = process.hrtime()
        const result = await Model.findOneAndUpdate(
            {id: item.id},
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
            const result = await Model.deleteOne({id})

            return {}
        }
        const result = await Model.updateOne(
            {id},
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
        getById,
        updateById,
        insertMany,
        create,
        getAll,
        removeAll,
        removeById,
        createMany,
        Model
    }
}

export default mongoRepository


export const getMongoModel = <EID extends string, Attrs extends AnyAttributes>(schema: Schema, collectionName:EID) => {
    // 1. Create an interface representing a document in MongoDB.
// 2. Create a Schema corresponding to the document interface.

    const collections = mongoose.connection.collections
    const models = mongoose.connection.modelNames()
     try {
       //  await mongoose.deleteModel(collectionName)
     } catch (e) {
        console.log(e)
     }
      const ItemModel = mongoose.models[collectionName] || model(collectionName,schema,);
// 3. Create a Model.
 //   class Person extends Model { }
  //  const Item = model<typeof entity.exampleItem>(entity.collection,schema);

    return ItemModel
}
const mapMetaProp = <M extends AnyAttr= AnyAttr>(prop: M) => {

    if(prop.type === 'string') {
        return Type.string({})
    }
    else if(prop.type === 'boolean') {
        return Type.boolean({})
    }
    if(prop.type === 'number') {
        return Type.number({})
    }
    if(prop.type === 'array') {
        return Type.array({}).of(Type.mixed({}))
    }
    if(prop.type === 'date' || prop.type === 'datetime') {
        return Type.string({})
    }
    return Type.mixed({})


}
const buildMongooseByResource =  <Properties extends AnyAttributes>(entity: EntitySlice<Properties>) => {
    const obj = {} as any as  EntitySlice<Properties>['attributes']
    Object.keys(entity.attributes).map( k =>
        obj[k] = mapMetaProp(entity.attributes[k]))
    const schema = createSchema({...obj},  {strict: false,  timestamps: false, versionKey: false,})
    return schema
}