import {createCRUDDuck} from "@sha/fsa";
import {ISOState} from "../../../ISOState";
import type {UserVO} from "./user-schema";
import chroma from 'chroma-js'
import {IssueVO} from './Issues-schema'
import {ContractVO} from './contracts-schema'
import {AddressVO} from './addresses-schema'


const duck = createCRUDDuck('addresses', 'addressId', {} as any as AddressVO)


export const addressesCrud = {
    ...duck,
    plural: 'Адреса',
    actions: {
        ...duck.actions,
    },
}

export default addressesCrud
