import mongoose from 'mongoose'
import {createSchema, ExtractDoc, ExtractProps, Type} from 'ts-mongoose'
import getMongoRepository from 'iso/src/getMongoRepository'
import {generateEventGuid} from '@sha/random';

export const EventSchema = createSchema({
    guid: Type.string({unique: true, required: true}),
    type: Type.string({required: true}),
    payload: Type.mixed(),
    tags: Type.array().of(Type.string()),
    userId: Type.string({}),
    meta: Type.mixed(),
    isCommand: Type.boolean({default: false}),
    parentGuid: Type.string(),
}, {timestamps: {createdAt: true}})

export type EventDoc = ExtractDoc<typeof EventSchema>

export type EventVO = ExtractProps<typeof EventSchema>
let _eventStore

const eventStore = async (mongoose: mongoose.Connection) => {

        const Model = await getMongoRepository(mongoose, 'events', EventSchema)

        const create = async (item: EventVO): Promise<EventVO> => {
            if (!item.guid)
                item.guid = generateEventGuid()

            const doc = await Model.create(item)

            return doc.toObject()
        }

        const removeAll = async (): Promise<any> =>
            await Model.deleteMany({})

        const getAll = async (options = {}): Promise<any> =>
            await Model.find(options).lean()

        _eventStore = {
            create,
            removeAll,
            getAll,
            Model,
        }

        return _eventStore

}

export default eventStore
