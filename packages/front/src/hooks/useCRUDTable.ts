import CreateCRUDDuck, {Crud} from '@sha/fsa/src/createCRUDDuck'
import {useSelector} from 'react-redux'
import {ColumnsType} from 'antd/es/table'


export default <T>(curd: Crud<T>, columns: ColumnsType<T>) => {
    const list = useSelector(curd.selectList)
}