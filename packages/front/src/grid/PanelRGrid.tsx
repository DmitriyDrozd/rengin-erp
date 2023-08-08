import {AgGridReactProps} from 'ag-grid-react'
import {AnyFieldsMeta} from 'iso/src/store/bootstrap/core/createResource'
import RGrid, {RGridProps} from './RGrid'
import {Card, Input} from 'antd'
import {useAllColumns} from './RCol'
import {useSelector} from 'react-redux'
import {SearchOutlined} from '@ant-design/icons'
import CrudCreateButton from '../components/elements/CreateButton'
import {ChangeEventHandler, useState} from 'react'

export default  <RID extends string, Fields extends AnyFieldsMeta>({title, columnDefs, resource,rowData,defaultCreateItemProps,...props}: RGridProps<RID, Fields> & {title: string}) => {

    const [defaultColumns] = useAllColumns(resource)
    const defaultList = useSelector(resource.selectList)
    const [searchText, setSearchText] = useState('')

    const onSearchTextChanged :ChangeEventHandler<HTMLInputElement> = e => {
        setSearchText(e.target.value)
    }

    return      <> <div
        style={{
            height: '48px',
            lineHeight: '48px',
            boxShadow: '0 1px 4px rgba(0,21,41,.12)',
            padding: '0 16px',
            width: '100%',
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center'
        }}
    >
        <h3 style={{whiteSpace:'nowrap'}}>{title}</h3>
        <div style={{display: 'flex'}}>
            <Input
                style={{maxWidth: '250px', marginRight: '16px'}}
                addonBefore={<SearchOutlined />} placeholder="Быстрый поиск"
                allowClear
                value={searchText}
                onChange={onSearchTextChanged}
            />
            <CrudCreateButton resource={resource} defaultProps={defaultCreateItemProps} />
        </div>
    </div>
        <RGrid {...props} columnDefs={columnDefs || defaultColumns} rowData={rowData || defaultList} resource={resource} quickFilterText={searchText}/>
    </>
 }