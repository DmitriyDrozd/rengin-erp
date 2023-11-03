import {AgGridReact} from 'ag-grid-react'
import {AnyFieldsMeta} from 'iso/src/store/bootstrap/core/createResource'
import RGrid, {RGridProps} from './RGrid'
import {Button, Dropdown, Input, MenuProps, Space, Typography} from 'antd'
import {useAllColumns} from './RCol'
import {useDispatch, useSelector} from 'react-redux'
import {DownloadOutlined, SearchOutlined} from '@ant-design/icons'
import CrudCreateButton from '../components/elements/CreateButton'
import React, {ChangeEventHandler, useCallback, useRef, useState} from 'react'
import {AntdIcons} from '../components/elements/AntdIcons'
import DeleteButton from '../components/elements/DeleteButton'
import CancelButton from '../components/elements/CancelButton'
import useRole from "../hooks/useRole";


const items: MenuProps['items'] =
    [{
        label: 'Сохранить',
        icon: <AntdIcons.SaveFilled/>,
        key: 'save'
    },{
        label:'Назначенные мне',
        icon:<AntdIcons.EyeInvisibleFilled/>,
        key:'hide'
    },
        {
            type: 'divider'
        },{
        label:'Удалить записи',
        icon:<AntdIcons.DeleteFilled/>,
        key:'delete',
        danger: true
    }]

export default  <RID extends string, Fields extends AnyFieldsMeta>({title,gridRef, toolbar, columnDefs, resource,rowData,createItemProps,...props}: RGridProps<RID, Fields> & {title: string; onCreateClick: (defaults: any) => any, toolbar?: React.ReactNode}) => {
    const dispatch = useDispatch()
    const [isDeleteMode, setDeleteMode,] = useState(false)
    const [defaultColumns, columnsMap] = useAllColumns(resource,isDeleteMode? 'multiple':undefined)
    const firstCol = isDeleteMode ? columnsMap.checkboxCol:columnsMap.clickToEditCol

    const resultCols = columnDefs || [firstCol,...(columnDefs || defaultColumns)]

    const defaultList = useSelector(resource.selectList)
    const [searchText, setSearchText] = useState('')

    const [selectedIds,setSelectedIds] = useState([])

    const onSearchTextChanged :ChangeEventHandler<HTMLInputElement> = e => {
        setSearchText(e.target.value)
    }

    const onMenuClick = (key) => {
        if(key ==='delete') {
            setDeleteMode(true)
            setSelectedIds([])
        }
    }

    const onDelete = () => {
        const action = resource.actions.removedBatch(selectedIds)
        dispatch(action)
        setSelectedIds([])
        setDeleteMode(false)
    }

    const innerGridRef = useRef<AgGridReact>(null);

    const onSelectionChanged = () => {
        const rows = innerGridRef.current!.api.getSelectedRows()
        const ids = rows.map(r =>r[resource.idProp])
        setSelectedIds(ids);
    }

    const renderDeleteModeToolBar = () => {
        return <>
                    <DeleteButton disabled={selectedIds.length === 0} onDeleted={onDelete}/>
                    <CancelButton onCancel={() => setDeleteMode(false)}/>

                </>
    }
    const role = useRole()
    const renderStandartToolBar = () => {

        return role === 'сметчик'
            ? <Typography.Text>Вы можете редактировать сметы</Typography.Text>
            :<>
            <CrudCreateButton resource={resource} defaultProps={createItemProps} />
            <Dropdown menu={{
                items,onClick: e => {
                    onMenuClick(e.key)
                }}} >
                <Button icon={<AntdIcons.SettingOutlined/>} type={'text'}/>
            </Dropdown>
        </>
    }
    const onBtExport = useCallback(() => {
        innerGridRef.current!.api.exportDataAsExcel();
    }, []);

    return      <> <div
        style={{
            height: '48px',

            boxShadow: '0 1px 4px rgba(0,21,41,.12)',
            padding: '0 10px 0 10px',
            width: '100%',
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center'
        }}
    >
        <h3 style={{whiteSpace:'nowrap'}}>{title}</h3>
        {
            toolbar
        }
        <div style={{display: 'flex'}}>
            <Space>
                <Input

                    style={{maxWidth: '250px', marginRight: '16px', lineHeight:'unset'}}
                    addonBefore={<SearchOutlined />} placeholder="Быстрый поиск"
                    allowClear
                    value={searchText}
                    onChange={onSearchTextChanged}
                />
                {
                    isDeleteMode ? renderDeleteModeToolBar(): renderStandartToolBar()
                }
            </Space>
        </div>
    </div>
        <RGrid onSelectionChanged={onSelectionChanged}   rowSelection={isDeleteMode?'multiple':undefined} {...props} columnDefs={resultCols} rowData={rowData || defaultList} resource={resource} quickFilterText={searchText} ref={innerGridRef}/>
        <div style={{paddingTop: '4px', display: 'flex', justifyContent:'space-between' }}>
            <Space>

                <Typography.Text>Всего записей: {rowData.length}</Typography.Text>

            </Space>

            <Space>
                <Button icon={<DownloadOutlined />} onClick={onBtExport} >Скачать .xlsx</Button>
            </Space>
        </div>
    </>
 }