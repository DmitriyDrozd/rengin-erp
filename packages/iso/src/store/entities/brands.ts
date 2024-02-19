import {AttrFactories_ex, createEntitySlice} from "@shammasov/mydux";


export const BRANDS = createEntitySlice('BRANDS',{

        brandName: AttrFactories_ex.string({required: true,headerName: 'Компания', unique:true}),
        brandType: AttrFactories_ex.enum({required: true,  headerName: 'Сторона',enum: ['Заказчик','Исполнитель']}),
        person: AttrFactories_ex.string({headerName: 'Контактное лицо'}),
        email: AttrFactories_ex.string({headerName: 'Email'}),
        phone: AttrFactories_ex.string({headerName: 'Телефон'}),
        address: AttrFactories_ex.string({headerName: 'Адрес'}),
        web: AttrFactories_ex.string({headerName: 'Вебсайт'}),
        managerUserId: AttrFactories_ex.itemOf({headerName: 'Отв. менеджер', linkedEID:'USERS'}),
        removed: AttrFactories_ex.boolean({select: false, colDef: false,internal:true}),
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
