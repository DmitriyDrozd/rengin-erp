import {createDB, createTable, Database} from 'blinkdb';
import { ModelOf, ValidModel } from '@blinkdb/react';
import type {IssueVO} from 'iso/src/store/bootstrap/repos/issues'
import type {UserVO} from 'iso/src/store/bootstrap/repos/users'
import {PrimaryKeyOf} from 'blinkdb/src/types'
import {EventVO} from 'service/src/repositories/eventStore'

interface IndexedEventVO {
    brandId?: string | undefined
    contractId?: string | undefined
    issueId?: string | undefined
    legalId?: string | undefined
    siteId?: string | undefined
    subId?: string | undefined
    guid: string
    type?: string | undefined
    userId?: string | undefined
    payload: string | undefined
    createdAt: Date | undefined
    updatedAt: Date | undefined
}

type PrimaryKey = string | number;
export type PK<T> = keyof T &
    {
        [Key in keyof T]: T[Key] extends PrimaryKey ? Key : never;
    }[keyof T];

type D = {
    a: number
    b: string
    c?:string
    d: number|undefined
}
type P = PK<D>
type IndexKeysOf<T> =
    keyof {
        [Key in keyof T]: T[Key] extends undefined ? Key : never
    };
export type NullableKeys<T> = {
    [P in keyof T]-? :  Extract<T[P], null | undefined> extends never ? never: P
}[keyof T]
export type ExtractNullable<T> = {
    [P in NullableKeys<T>]: NonNullable<T[P]>
}
type IKeys = keyof ExtractNullable<D>
const k:IKeys = 'a'

export const db = createDB();

export type IndexableItem<T, P extends PrimaryKeyOf<T>> = {
    [K in IndexKeysOf<{[N in Exclude<keyof T, P>]: T[N]}>]: string | undefined
} & {
    [ID in P]: NonNullable<string>
}

type PrimaryOfIssue = PrimaryKeyOf<IssueVO>
const a :IssueVO={userId:3,}
type IndexableIssueVO = IndexableItem<IssueVO, 'issueId'>
const i: IndexableIssueVO ={
    issueId:'a',
    userId:undefined,
}
type A = typeof i
export const blinkModel = {
   /* eventsTable: createTable<IndexableItem<IndexedEventVO, 'guid'>>(db, 'events')({
        primary:'guid',
        indexes:['type','brandId','siteId','userId', 'siteId',
            'issueId','contractId','legalId','subId'
        ]}),*/

    issuesTable: createTable<Required<IndexableIssueVO>>(db,'issues')({primary: 'issueId',indexes:['userId','clientsIssueNumber','legalId']})
   // posts: createTable<Post>(db, "posts")(,
} satisfies ValidModel;
// ^^^ `satisfies ValidModel` is optional, for recommended

// Create your Model type - this is used by `useTable` hooks
export type BlinkDBModel = ModelOf<typeof blinkModel>;
// ---
// First, create an object that holds all your tables
// ---

