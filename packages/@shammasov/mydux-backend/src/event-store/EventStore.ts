import mongoose from 'mongoose'
import {createSchema, ExtractDoc, ExtractProps, Type} from 'ts-mongoose'

import {generateEventGuid} from '@shammasov/utils';
import {getMongoModel} from "../mongo-entities";

export const EventSchema = createSchema({

    guid: Type.string({unique: true, required: true}),
    type: Type.string({required: true}),
    payload: Type.mixed(),
    tags: Type.array().of(Type.string()),
    userId: Type.string({}),
    meta: Type.mixed(),
    isCommand: Type.boolean({default: false}),
    parentGuid: Type.string(),
    storeGuid: Type.string(),
    createdAt: Type.date({required: false, default: Date.now as any }),
}, {versionKey:false, strict: false})

export type EventDoc = ExtractDoc<typeof EventSchema>

export type EventVO = ExtractProps<typeof EventSchema>
const a = {} as any  as EventVO

let _eventStore

const EventStore = (connection: mongoose.Connection) => {


 //   await connection.db.
        const Model = getMongoModel( EventSchema,'events')

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

export default EventStore
