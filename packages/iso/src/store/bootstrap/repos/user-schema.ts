import {Model, Schema, model, FlattenMaps} from 'mongoose';
import {UnPromisify} from '@sha/utils'
import {createSchema, ExtractProps, Type} from 'ts-mongoose'


export const UserSchema = createSchema({
            _id: Type.objectId({select: false, required: true, auto: true}),
            userId: Type.string({required: true, unique: true}),
            role: Type.string({}),
            fullName: Type.string(),
            title: Type.string(),
            company: Type.string(),
            avatarUrl: Type.string(),
            email: Type.string({required: true, unique: true, trim: true, toLowerCase: true}),
            password: Type.string({required: true, unique: true, trim: true}),
            removed: Type.boolean({select: false}),
    },
    {strict: false, timestamps: true, versionKey: false}
)

export type UserVO = ExtractProps<typeof UserSchema>

export const defaultAdminUser: UserVO = {
    userId: 'root',
    email: 'miramaxis@gmail.com',
    company: 'shammasov.com',
    fullName: 'Шаммасов Максим Тимурович',
    password: '123456',
    title: 'Программист',
}

