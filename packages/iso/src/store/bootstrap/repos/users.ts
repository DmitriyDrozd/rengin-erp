import chroma from 'chroma-js'
import {createResource} from '../core/createResource'
import {valueTypes} from '../core/valueTypes'
import stringToHashInt from '../../../utils/string-to-hash-int'

export const roleTypes = ['руководитель','менеджер','сметчик','техник','ответственный инженер'] as const

export const roleEnum = {
    'руководитель':'руководитель',
    'менеджер':'менеджер',
    'сметчик':'сметчик',
    'клиент':'клиент',
    'техник':'техник',
    'ответственный инженер':'ответственный инженер'
}

export type RoleType = typeof roleTypes[number]

const usersRaw = createResource('user',{
    role: valueTypes.enum({required: true, enum: roleTypes, headerName: 'Роль'}),
    brandId: valueTypes.itemOf({
        headerName:'Организация',
        linkedResourceName:'BRANDS'
    }),
    lastname: valueTypes.string({required: true, colDef:{width: 250}, headerName:'Фамилия'},),
    name: valueTypes.string({required: true, colDef:{width: 250}, headerName:'Имя'},),
    title: valueTypes.string({headerName: 'Должность', colDef: {width: 200}}),


    email: valueTypes.string({required: true, toLowerCase: true, colDef: {width: 250}}),
    phone: valueTypes.string({ toLowerCase: true, colDef: {width: 250}}),
    avatarUrl: valueTypes.string({colDef:false}),
    password: valueTypes.string({required: true, colDef: false}),
    removed: valueTypes.boolean({select: false, colDef: false,internal:true}),
},{
   getItemName: item => item.lastname +' '+ item.name,
    langRU: {
        singular: 'Пользователь',
        plural: 'Пользователи',
        some: 'Пользователя'
    }
})






const selectUserByEmail = (email: string) => (state) => {

    const users = state.app.bootstrap.users

    if (!email)
        return undefined

    const userByEmail = (users as any as UserVO[]).find(user =>
            user.email && (
                user.email.toLowerCase() === email.toLowerCase()
            )
    )
    return userByEmail
}

var uiAvatarColors = [
    '#775DD0',
    '#FF9800',
    '#A5978B',
    '#FD6A6A',
    '#69D2E7',
    '#C5D86D',
    '#E2C044',
    '#C4BBAF',
    '#00B1f2',
    '#8b71e4',
    '#ffac14',
    '#b9ab9f',
    '#ff7e7e',
    '#7de6fb',
    '#d9ec81',
    '#f6d458',
    '#d8cfc3',
    '#14c5ff',
] as const
let fontColors = ['#f5f6f9', '#383a3e'] as const
var generateGravatar = (index, n, s) => {
    const num = index % uiAvatarColors.length
    const bgColor = uiAvatarColors[num]

    const c1 = chroma.contrast(bgColor, '#f5f6f9')
    const c2 = chroma.contrast(bgColor, '#383a3e')

    const color = chroma.contrast(bgColor, '#f5f6f9') > chroma.contrast(bgColor, '#383a3e')
        ? 'f5f6f9' : '383a3e'
    return `https://ui-avatars.com/api/?background=${bgColor.substring(1)}&font-size=${0.4}&color=${color}&format=svg&name=${n}+${s}`
}

export const getAbbrName = (user) =>  {
    const parts = (user.fullName || "Новый Пользователь Отчество").split(' ')
    const getPart = (index: number) => {
        const part = parts[index]
        if(index === 0) {
            return part
        }
        return (part && part.length ) ? (' '+part[0]+'.') : ""
    }

    return getPart(0)+getPart(1)+ getPart(2)
}
export const ROLES_COLORS = ['red','blue','purple','green','black']
export const ROLES = ['admin','manager','booker','engineer','worker'] as const
export type Role = typeof ROLES[number]

export const defaultAdminUser = {
    role: 'Admin',
    removed: false,
    avatarUrl: undefined,
    userId: 'root',
    email: 'miramaxis@gmail.com',
    company: 'shammasov.com',
    fullName: 'Шаммасов Максим Тимурович',
    password: '123456',
    title: 'Программист',

} as any as UserVO
export const usersResource = {
    ...usersRaw,
    getItemName: (item) =>
        getAbbrName(item),
    actions: {
        ...usersRaw.actions,
      //  usersListUpdated: rawUsersResource.factory<UserVO[]>('usersListUpdated')
    },
    selectUserByEmail,
selectAbbrName: (userId: string) => (state) => {
        const user = usersRaw.selectById(userId)(state)
    return getAbbrName(user as any)
},
    selectUserByCredentials: ({email, password}) => (state) => {
        const user = selectUserByEmail(email)(state)
        return (user && user.password === password)
            ? user
            : undefined
    },
    selectAvatar: (userId: string) => (state): string => {
        const user:UserVO = usersRaw.selectById(userId)(state) as any
        if(user.avatarUrl)
            return user.avatarUrl
        const num = stringToHashInt(userId)
        return generateGravatar(num, user.name ? user.name.charAt(0) : '', (user.lastname?user.lastname.charAt(0): ''))
    },

}
export const USERS = usersResource

export default usersResource
export type UserVO = typeof usersRaw.exampleItem
