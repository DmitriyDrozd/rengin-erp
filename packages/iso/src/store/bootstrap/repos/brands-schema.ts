import {createSchema, ExtractProps, Type} from 'ts-mongoose'
export const BrandSchema = createSchema({
        brandId: Type.string({required: true, unique: true}),
        brandName: Type.string(),
        email: Type.string(),
        removed: Type.boolean({select: false}),
    },
    {strict: false, timestamps: true, versionKey: false}
)

export type BrandVO = ExtractProps<typeof BrandSchema>
