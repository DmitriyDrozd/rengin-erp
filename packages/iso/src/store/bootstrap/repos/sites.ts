import {createResource} from '../core/createResource'
import {valueTypes} from '../core/valueTypes'
import {
    employeeRoleEnum,
    EmployeeVO
} from './employees';
import {LegalVO} from './legals'
import {
    roleEnum,
    UserVO
} from './users';


export const siteResourceRaw = createResource('site',{
        clientsSiteNumber: valueTypes.string({headerName:'Код объекта', required: true, unique: true}),
        brandId: valueTypes.itemOf({
            headerName: 'Заказчик',
            linkedResourceName: 'BRANDS',
            required: true
        }),
       /* region: valueTypes.string({
            headerName: 'Регион',
            required: true
        }),*/
        legalId: valueTypes.itemOf({
            headerName: 'Юр. Лицо',
            linkedResourceName: 'LEGALS',
            required: true,
            filterLinkedResourceItems: (list: LegalVO[], source: any) => {
                return list.filter(item => item.brandId === source?.brandId)
            }
        }),
        city: valueTypes.string({
            headerName: 'Город',
            required: true
        }),
        address: valueTypes.string({
            headerName: 'Адрес',
            required: true
        }),
        contactInfo: valueTypes.text({headerName:'Контакты'}),
        KPP: valueTypes.string({headerName: 'КПП'}),
        managerUserId: valueTypes.itemOf({
            headerName: 'Менеджер',
            linkedResourceName:'USERS',
            defaultAsPropRef:'legalId',
            filterLinkedResourceItems: (list: UserVO[]) => list.filter(item => item.role === roleEnum['менеджер']),
        }),
        techUserId: valueTypes.itemOf({
            headerName: 'Техник',
            linkedResourceName:'EMPLOYEES',
            filterLinkedResourceItems: (list: EmployeeVO[]) => list.filter(item => item.role === employeeRoleEnum['техник']),
        }),
        clientsEngineerUserId: valueTypes.itemOf({
            headerName:'Отв. инженер',
            linkedResourceName:'EMPLOYEES',
            defaultAsPropRef:'legalId',
            filterLinkedResourceItems: (list: EmployeeVO[]) => list.filter(item => item.role === employeeRoleEnum['ответственный инженер']),
        }),
    },
    {
        getItemName: item => item?.city+', '+item?.address,
        langRU: {
            singular: 'Адрес',
            plural: 'Адреса',
            some: 'Адресов'
        }
    }
)

const siteResource = {
    ...siteResourceRaw,
    clientsNumberProp: 'clientsSiteNumber',
    rolesProps: ['managerUserId', 'techUserId', 'clientsEngineerUserId'],
};

export type SiteVO = (typeof siteResource)['exampleItem']

export const SITES = siteResource
export default SITES