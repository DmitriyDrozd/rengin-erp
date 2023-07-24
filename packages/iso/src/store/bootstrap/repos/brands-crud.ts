import {createCRUDDuck} from "@sha/fsa"
import {BrandVO} from './brands-schema'
const duck = createCRUDDuck('brands', 'brandId', {} as any as BrandVO)

export const brandsCrud = {
    ...duck,
    plural: 'Заказчики',
}

export default brandsCrud
