import {createResource} from '../core/createResource'
import {valueTypes} from '../core/valueTypes'

export const employeeRoleEnum = {
    'техник':'техник',
    'ответственный инженер':'ответственный инженер'
}

export const employeeRoleTypes = [
    employeeRoleEnum.техник,
    employeeRoleEnum['ответственный инженер']
] as const

const employeesRaw = createResource('employee',{
    role: valueTypes.enum({required: true, enum: employeeRoleTypes, headerName: 'Роль'}),
    brandId: valueTypes.itemOf({
        headerName:'Организация',
        linkedResourceName:'BRANDS'
    }),
    lastname: valueTypes.string({required: true, colDef:{width: 250}, headerName:'Фамилия'},),
    name: valueTypes.string({required: true, colDef:{width: 250}, headerName:'Имя'},),
    title: valueTypes.string({headerName: 'Должность', colDef: {width: 200}}),
    email: valueTypes.string({toLowerCase: true, colDef: {width: 250}}),
    phone: valueTypes.string({ toLowerCase: true, colDef: {width: 250}}),
    clientsEmployeeNumber: valueTypes.string({headerName:'Номер', required: true, immutable: true, unique: true}),
    removed: valueTypes.boolean({select: false, colDef: false,internal:true}),
},{
    getItemName: item => item.lastname +' '+ item.name,
    langRU: {
        singular: 'Сотрудник',
        plural: 'Сотрудники',
        some: 'Сотруднка'
    }
})

export const getAbbrName = (user) =>  {
    const parts = (user?.fullName || "Новый Сотрудник Отчество").split(' ')
    const getPart = (index: number) => {
        const part = parts[index]
        if(index === 0) {
            return part
        }
        return (part && part.length ) ? (' '+part[0]+'.') : ""
    }

    return getPart(0)+getPart(1)+ getPart(2)
}

export const ROLES = ['engineer','worker'] as const
export type Role = typeof ROLES[number]

export const employeesResource = {
    ...employeesRaw,
    getItemName: (item) =>
        getAbbrName(item),
    actions: { ...employeesRaw.actions },
    clientsNumberProp: 'clientsEmployeeNumber',
}

export const EMPLOYEES = employeesResource

export default employeesResource
export type EmployeeVO = typeof employeesRaw.exampleItem