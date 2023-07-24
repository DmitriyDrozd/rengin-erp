import {Crud} from '@sha/fsa/src/createCRUDDuck'
import {useDispatch, useSelector} from 'react-redux'
import {nanoid} from 'nanoid'
import {useState} from 'react'

export default <T>(crud: Crud<T>, id: string = 'new') => {
    const dispatch = useDispatch()
    const prevItem = useSelector(crud.selectById(id))
    const [newItem] = useState({[crud.idProp]: nanoid(6)})
    const initialItem: T =( id === 'new' ? newItem : prevItem) as any as T
    const [item, setItem] = useState(initialItem)
    const saveItem = (newItem: T) => {
        if(id === 'new')
            dispatch(crud.actions.added(newItem))
        else
            dispatch(crud.actions.patched(newItem, item))
    }
    return [item, saveItem]
}