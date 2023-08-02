import {createResource} from '../core/createResource'
import {valueTypes} from '../core/valueTypes'
import {RESOURCES_MAP} from '../resourcesList'


export const siteResource = createResource('site',{
        legalId: valueTypes.itemOf({
            headerName: 'Юр. Лицо',
            res: 'LEGALS',
            required: true
        }),
        city: valueTypes.string({
            headerName: 'Город',
            required: true
        }),
        address: valueTypes.string({
            headerName: 'Адрес',
            required: true
        }),
        responsibleEngineer: valueTypes.string({headerName:'Ответственный инженер'}),
        contractId: valueTypes.itemOf({
            headerName: 'Договор',
            res: 'CONTRACTS'
        }),
        KPP: valueTypes.string({headerName: 'КПП'}),
    },
    {
        langRU: {
            singular: 'Адрес',
            plural: 'Адреса',
            some: 'Адресов'
        }
    }
)


export type SiteVO = (typeof siteResource)['exampleItem']

export const SITES = siteResource


export default SITES