/**
 * 1. Спроектирован
 *
 * 2. Заказан
 *
 * 3. Оплачен
 *
 * 4. Изготовлен
 *
 * 5. Доставлен\принят
 *
 * 6. Смонтирован
 *
 * 7. Принят стройконтролем
 *
 * 8. Поврежден\требует замены
 */
import {ISOState} from '../../ISOState'
import {sort, splitAt} from 'ramda'


export type StoneStatus = {
    statusType: 'blocks' | 'windows'
    exStatusId: number
    statusId: number
    color: string
    name: string
    description: string
    nextStatusesIds: number[]
    prevStatusesIds: number[]
    includesRaw: string
    includedStatusIds: number[]

}
const diff = function(a, b) { return a - b; }

const sortNumbers = sort(diff)

export const sortStatusIds = (list: number[]) => {
    const sorted = sortNumbers(list)
const [head, tail] = splitAt(1, sorted)

    return [...tail, ...head]
}
export const selectStatusesByType = (type: string = undefined) => (state: ISOState) => {
    const allStatuses = state.app.bootstrap.settings.statuses
    if(type)
        return allStatuses.filter(s => s.statusType === type)

    return allStatuses
}