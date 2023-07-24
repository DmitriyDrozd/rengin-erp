import {Model, Schema, model, FlattenMaps} from 'mongoose';
import {UnPromisify} from '@sha/utils'
import {createSchema, ExtractProps, Type} from 'ts-mongoose'
export const ContractsSchema = createSchema({
        _id: Type.objectId({select: false, required: true, auto: true}),
        contractId: Type.string({required: true, unique: true}),
        legalNumber: Type.string({}),
        brand: Type.string({}),
        companyName: Type.string({}),
        addressIds: Type.array({default: []}).of(Type.string()),
        startDate: Type.date(),
        endDate: Type.date(),
        rate: Type.number(),
        managerId: Type.string(),
        removed: Type.boolean({select: false}),
    },
    {strict: false, timestamps: true, versionKey: false}
)

export type ContractVO = Required<ExtractProps<typeof ContractsSchema>>
