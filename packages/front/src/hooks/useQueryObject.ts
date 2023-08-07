import {useLocation} from 'react-router'
import {useMemo} from 'react'

export function useQueryObject<T>() {
    const { search } = useLocation();
    return useMemo(() =>  Object.fromEntries(new URLSearchParams(search)), [search]);
}