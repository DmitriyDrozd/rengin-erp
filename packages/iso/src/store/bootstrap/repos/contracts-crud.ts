import {createCRUDDuck} from "@sha/fsa";

import {ContractVO} from './contracts-schema'


const duck = createCRUDDuck('contracts', 'contractId', {} as any as ContractVO)


export const contractsCrud = {
    ...duck,
    actions: {
        ...duck.actions,


    },

}

export default contractsCrud
