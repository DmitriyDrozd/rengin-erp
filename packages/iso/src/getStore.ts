import {isBrowser} from '@sha/utils'

export const getStore = () =>
    isBrowser() ? window['store'] : undefined

