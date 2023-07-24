import {createSchema, ExtractProps, Type} from 'ts-mongoose'
export const CompanySchema = createSchema({
        companyId: Type.string({required: true, unique: true}),
        companyName: Type.string(),
        brandId: Type.string(),
        kpp: Type.string(),
        removed: Type.boolean({select: false}),
    },
    {strict: false, timestamps: true, versionKey: false}
)

export type CompanyVO = ExtractProps<typeof CompanySchema>
