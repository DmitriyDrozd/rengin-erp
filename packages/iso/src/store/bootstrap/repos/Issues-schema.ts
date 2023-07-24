import { Model, Schema, model } from 'mongoose';
import {UnPromisify} from '@sha/utils'
import {createSchema, ExtractProps, Type} from 'ts-mongoose'
export const IssuesSchema = createSchema({
        issueId: Type.string(),
        clientsIssueId: Type.string(),
        status: Type.string(),
        clientId: Type.string(),

        payMode: Type.string(),
        contractId: Type.string(),

        managerId: Type.string(),
        responsibleEngineer: Type.string(),

        registerDate: Type.date(),
        workStartedDate: Type.date(),
        plannedDate: Type.date(),
        completedDate: Type.date(),

        description: Type.string(),
        removed: Type.boolean({select: false}),
    },
    {strict: false, timestamps: true, versionKey: false}
)

export type IssueVO = ExtractProps<typeof IssuesSchema>
