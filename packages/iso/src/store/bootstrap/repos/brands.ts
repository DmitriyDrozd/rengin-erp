import {valueTypes} from '../core/valueTypes'
import {createResource} from '../core/createResource'


export const BRANDS = createResource('brand',{
        brandName: valueTypes.string({required: true, unique: true,headerName: 'Заказчик'}),
        person: valueTypes.string({required: true, headerName: 'Контактное лицо'}),
        email: valueTypes.string({headerName: 'Email'}),
        tel: valueTypes.string({headerName: 'Телефон'}),
    },
    {
        nameProp: 'brandName',
        langRU:{
            singular:'Заказчик',
            plural:'Заказчики',
            some:'Заказчика'
        }
    }
)
export default BRANDS

export type BrandVO =typeof BRANDS.exampleItem
