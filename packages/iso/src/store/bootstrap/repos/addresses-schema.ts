import {Model, Schema, model, FlattenMaps} from 'mongoose';
import {UnPromisify} from '@sha/utils'
import {createSchema, ExtractProps, Type} from 'ts-mongoose'
export const AddressesSchema = createSchema({
        addressId: Type.string({required: true, unique: true}),
        clientId: Type.string(),
        address_region: Type.string(),
        address_city: Type.string(),
        address_street: Type.string(),
        email: Type.string(),
        legalName: Type.string(),
        removed: Type.boolean({select: false}),
        responsibleEngineer: Type.string(),
        kpp: Type.string(),
        brand: Type.string(),
        companyName: Type.string(),
    },
    {strict: false, timestamps: true, versionKey: false}
)

export type AddressVO = ExtractProps<typeof AddressesSchema>
