import {createCRUDDuck} from "@sha/fsa";
import {ISOState} from "../../../ISOState";
import {Bootstrap} from "../../bootstrapDuck";
import type {UserVO} from "./user-schema";
import chroma from 'chroma-js'
import {IssueVO} from './Issues-schema'


const duck = createCRUDDuck('issues', 'issueId', {} as any as IssueVO)


export const issuesCrud = {
    ...duck,
    actions: {
        ...duck.actions,

    },

}

export default issuesCrud
