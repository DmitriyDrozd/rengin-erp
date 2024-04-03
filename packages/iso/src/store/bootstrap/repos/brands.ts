import {valueTypes} from '../core/valueTypes'
import {createResource} from '../core/createResource'


const BRANDS_RAW = createResource('brand',{
        brandName: valueTypes.string({required: true,headerName: 'Компания', unique:true}),
        brandType: valueTypes.enum({required: true, headerName: 'Сторона',enum: ['Заказчик','Исполнитель']}),
        person: valueTypes.string({headerName: 'Контактное лицо'}),
        email: valueTypes.string({headerName: 'Email'}),
        phone: valueTypes.string({headerName: 'Телефон'}),
        address: valueTypes.string({headerName: 'Адрес'}),
        web: valueTypes.string({headerName: 'Вебсайт'}),
        managerUserId: valueTypes.itemOf({headerName: 'Отв. менеджер', linkedResourceName:'USERS'}),
        clientsBrandNumber: valueTypes.string({headerName:'Номер', required: true, unique: true}),
        removed: valueTypes.boolean({select: false, colDef: false,internal:true}),
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

export const BRANDS = {
    ...BRANDS_RAW,
    clientsNumberProp: 'clientsBrandNumber',
    rolesProps: ['managerUserId'],
};

export default BRANDS


export type BrandVO =typeof BRANDS.exampleItem
