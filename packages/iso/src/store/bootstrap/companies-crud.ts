import {createCRUDDuck} from "@sha/fsa"
import {CompanyVO} from './companies-schema'
const duck = createCRUDDuck('companies', 'companyId', {} as any as CompanyVO)

export const companiesCrud = {
    ...duck,
    plural: 'Юр. Лица',
}

export default companiesCrud
