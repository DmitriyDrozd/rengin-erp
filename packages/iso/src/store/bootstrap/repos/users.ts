import {ISOState} from '../../../ISOState';

import chroma from 'chroma-js'
import stringToHashInt from '../../../utils/string-to-hash-int'
import {createResource} from '../core/createResource'
import {valueTypes} from '../core/valueTypes'

/**
 * TODO ACL rules are enougth for the first stage
 */

/**
 * 1. Строитель
 *
 * 2. Снабженец
 *
 * 3. Технадзор
 *
 * 4. Фасадчик
 *
 * 5. Архитектор
 */

enum RoleType {
    // no-no, ACL rules are enougth for the first stage
}

const rawUsersResource =createResource('user',{
    role: valueTypes.enum({headerName: 'Роль',enum: ['Root','Admin','Manager','Booker'] as const, required: true}),
    fullName: valueTypes.string({required: true}),
    title: valueTypes.string(),
    company: valueTypes.string(),
    avatarUrl: valueTypes.string(),
    email: valueTypes.string({required: true, unique: true, trim: true, toLowerCase: true}),
    password: valueTypes.string({required: true, unique: true, trim: true}),
    removed: valueTypes.boolean({select: false}),
    grids: valueTypes.item({required: true})
},{
    langRU: {
        singular: 'Пользователь',
        plural: 'Пользователи',
        some: 'Пользователя'
    }
})

export type UserVO = (typeof rawUsersResource)['exampleItem']



const selectUserByEmail = (email: string) => (state: ISOState) => {

    const users = state.app.bootstrap.users

    if (!email)
        return undefined

    const userByEmail = users.find(user =>
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
]
let fontColors = ['#f5f6f9', '#383a3e']
var generateGravatar = (index, n, s) => {
    const num = index % uiAvatarColors.length
    const bgColor = uiAvatarColors[num]

    const c1 = chroma.contrast(bgColor, '#f5f6f9')
    const c2 = chroma.contrast(bgColor, '#383a3e')

    const color = chroma.contrast(bgColor, '#f5f6f9') > chroma.contrast(bgColor, '#383a3e')
        ? 'f5f6f9' : '383a3e'
    return `https://ui-avatars.com/api/?background=${bgColor.substring(1)}&font-size=${0.4}&color=${color}&format=svg&name=${n}+${s}`
}

export const getAbbrName = (user: UserVO) =>  {
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


export const userResource = {
    ...rawUsersResource,
    getItemName: (item: UserVO) =>
        getAbbrName(item),
    actions: {
        ...rawUsersResource.actions,
        usersListUpdated: rawUsersResource.factory<UserVO[]>('usersListUpdated')
    },
    selectUserByEmail,
selectAbbrName: (userId: string) => (state: ISOState) => {
        const user = rawUsersResource.selectById(userId)(state)
    return getAbbrName(user as any)
},
    selectUserByCredentials: ({email, password}) => (state: ISOState) => {
        const user = selectUserByEmail(email)(state)
        return (user && user.password === password)
            ? user
            : undefined
    },
    selectAvatar: (userId: string) => (state): string => {
        const user = rawUsersResource.selectById(userId)(state)
        if(user.avatarUrl)
            return user.avatarUrl
        const num = stringToHashInt(userId)
        return generateGravatar(num, user.fullName[0], (user.fullName.split(' ')[1]
            ?  user.fullName.split(' ')[1].charAt(0)
            : user.fullName.charAt(1)))
    },

}

export const ROLES_COLORS = ['red','blue','purple','green','black']
export const ROLES = ['admin','manager','booker','engineer','worker'] as const
export type Role = typeof ROLES[number]

export const defaultAdminUser: UserVO = {
    role: 'Admin',
    removed: false,
    avatarUrl: undefined,
    userId: 'root',
    email: 'miramaxis@gmail.com',
    company: 'shammasov.com',
    fullName: 'Шаммасов Максим Тимурович',
    password: '123456',
    title: 'Программист',
    grids: {

    }
}

export const USERS = userResource

export default USERS