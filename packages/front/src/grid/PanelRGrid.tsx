import { RowDoubleClickedEvent } from 'ag-grid-community/dist/lib/events';
import { AgGridReact } from 'ag-grid-react';
import { useHistory } from 'react-router-dom';
import { AnyFieldsMeta } from 'iso/src/store/bootstrap/core/createResource';
import getCrudPathname from '../hooks/getCrudPathname';
import useLocalStorageState from '../hooks/useLocalStorageState';
import RGrid, { RGridProps } from './RGrid';
import {
    Button,
    Dropdown,
    Input,
    MenuProps,
    Space,
    Typography
} from 'antd';
import { useAllColumns } from './RCol';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    DownloadOutlined,
    SearchOutlined
} from '@ant-design/icons';
import CrudCreateButton from '../components/elements/CreateButton';
import React, {
    ChangeEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { AntdIcons } from '../components/elements/AntdIcons';
import DeleteButton from '../components/elements/DeleteButton';
import CancelButton from '../components/elements/CancelButton';
import useRole from '../hooks/useRole';


const getItems = (isExportAvailable: boolean, isAddItemsAvailable: boolean): MenuProps['items'] =>
    [
        // {
        //     label: 'Сохранить',
        //     icon: <AntdIcons.SaveFilled/>,
        //     key: 'save'
        // },
        // {
        //     label: 'Назначенные мне',
        //     icon: <AntdIcons.EyeInvisibleFilled/>,
        //     key: 'hide'
        // },
        // {
        //     type: 'divider'
        // },
        isAddItemsAvailable &&
        {
            label: 'Добавить к заявкам',
            icon: <AntdIcons.FileZipOutlined/>,
            key: GRID_MODES.addIssues,
        },
        isExportAvailable &&
        {
            label: 'Экспортировать записи',
            icon: <AntdIcons.FileZipOutlined/>,
            key: GRID_MODES.export,
        },
        {
            type: 'divider'
        },
        {
            label: 'Удалить записи',
            icon: <AntdIcons.DeleteFilled/>,
            key: GRID_MODES.delete,
            danger: true
        }];

export type BottomGridApiBar = React.FC<{ ag: AgGridReact }>

const GRID_MODES = {
    off: 'off',
    delete: 'delete',
    export: 'export',
    addIssues: 'addIssues',
};

const GRID_MODES_LIST = [
    GRID_MODES.off,
    GRID_MODES.delete,
    GRID_MODES.export,
    GRID_MODES.addIssues,
]

export default <RID extends string, Fields extends AnyFieldsMeta>(
    {
        name,
        title,
        gridRef,
        BottomBar,
        toolbar,
        columnDefs,
        resource,
        rowData,
        createItemProps,
        onExportArchive,
        onAddToItems,
        onShowAllItems,
        onCancelClick,
        ...props
    }: RGridProps<RID, Fields> & {
        name?: string,
        title: string;
        toolbar?: React.ReactNode,
        BottomBar?: BottomGridApiBar
        gridRef?: React.RefObject<typeof RGrid>,
        onExportArchive?(selectedIds: string[]): void,
        onAddToItems?(selectedIds: string[], updateCollection: (items: any[]) => void): void,
        onShowAllItems?(): void,
        onCancelClick?(): void,
    }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [mode, setMode] = useState(GRID_MODES.off);
    const resetMode = () => {
        setMode(GRID_MODES.off);
        onCancelClick?.();
    }

    const isMultipleSelection = mode !== GRID_MODES.off;

    const [defaultColumns, columnsMap] = useAllColumns(resource, isMultipleSelection ? 'multiple' : undefined);
    const usedColumns = columnDefs || defaultColumns;
    const [editColumn, ...restColumns] = usedColumns;
    const firstCol = isMultipleSelection ? columnsMap.checkboxCol : editColumn;

    const resultCols = [firstCol, ...restColumns];

    const defaultList = useSelector(resource.selectList);
    const list = rowData || defaultList;
    const [searchText, setSearchText] = useState('');

    const [selectedIds, setSelectedIds] = useState([]);

    const onSearchTextChanged: ChangeEventHandler<HTMLInputElement> = e => {
        setSearchText(e.target.value);
    };

    const onMenuClick = (key: string) => {
        if (GRID_MODES_LIST.includes(key)) {
            setMode(key);
            setSelectedIds([]);
        }

        if (key === GRID_MODES.addIssues) {
            onShowAllItems();
        }
    };

    const onDelete = () => {
        const action = resource.actions.removedBatch(selectedIds);
        dispatch(action);
        setSelectedIds([]);
        resetMode();
    };

    const onExport = () => {
        onExportArchive(selectedIds);
        setSelectedIds([]);
        resetMode();
    };

    const onAddToItemsHandler = () => {
        const getAction = (items) => resource.actions.updatedBatch(items);

        onAddToItems(selectedIds, (items) => dispatch(getAction(items)));
        setSelectedIds([]);
        resetMode();
    }

    const innerGridRef = gridRef || useRef<AgGridReact>(null);

    /**
     * Сохранение состояния таблицы
     */
    const [columnState, setColumnState] = useLocalStorageState((name || title) + 'ColumnState', null);
    const [isColumnStateInitialized, setIsColumnStateInitialized] = useState(!columnState);

    useEffect(() => {
        if (innerGridRef.current && innerGridRef.current.columnApi && !isColumnStateInitialized) {
            innerGridRef.current.columnApi.applyColumnState({ state: columnState, applyOrder: true });

            setTimeout(() => {
                setIsColumnStateInitialized(true);
            }, 200)
        }
    }, [innerGridRef.current, isColumnStateInitialized]);

    const onSortChanged = useCallback((ag: any) => {
        if (!isColumnStateInitialized) {
            return;
        }

        setColumnState(ag.columnApi.getColumnState());
    }, [isColumnStateInitialized]);

    const onRowDoubleClicked = (e: RowDoubleClickedEvent) => {
        const url = getCrudPathname(resource).edit(e.data[resource.idProp])
        history.push(url);
    }

    const onSelectionChanged = () => {
        const rows = innerGridRef.current!.api.getSelectedRows();
        const ids = rows.map(r => r[resource.idProp]);
        setSelectedIds(ids);
    };

    const renderDeleteModeToolBar = () => {
        return <>
            <DeleteButton disabled={selectedIds.length === 0} onDeleted={onDelete}/>
            <CancelButton onCancel={resetMode}/>
        </>;
    };

    const renderExportModeToolBar = () => {
        return (
            <>
                <Button
                    icon={<AntdIcons.FileZipOutlined/>}
                    disabled={selectedIds.length === 0}
                    onClick={onExport}
                >
                    Скачать архив
                </Button>
                <CancelButton onCancel={resetMode}/>
            </>
        )
    }

    const renderAddToModeToolBar = () => {
        return (
            <>
                <Button
                    icon={<AntdIcons.PlusCircleFilled />}
                    disabled={selectedIds.length === 0}
                    onClick={onAddToItemsHandler}
                >
                    Добавить к записям
                </Button>
                <CancelButton onCancel={resetMode}/>
            </>
        )
    }

    const role = useRole();
    const items = getItems(!!onExportArchive, !!onAddToItems);

    const renderStandardToolBar = () => {
        return role === 'сметчик'
            ? <Typography.Text>Вы можете редактировать сметы</Typography.Text>
            : <>
                <CrudCreateButton resource={resource} defaultProps={createItemProps}/>
                <Dropdown menu={{
                    items,
                    onClick: e => {
                        onMenuClick(e.key);
                    }
                }}>
                    <Button icon={<AntdIcons.SettingOutlined/>} type={'text'}/>
                </Dropdown>
            </>;
    };

    const onBtExport = useCallback(() => {
        innerGridRef.current!.api.exportDataAsExcel();
    }, []);

    return <>
        <div
            style={{
                height: '48px',
                boxShadow: '0 1px 4px rgba(0,21,41,.12)',
                padding: '0 10px 0 10px',
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <h3 style={{whiteSpace: 'nowrap'}}>{title}</h3>
            {
                toolbar
            }
            <div style={{display: 'flex'}}>
                <Space>
                    <Input
                        style={{maxWidth: '250px', marginRight: '16px', lineHeight: 'unset'}}
                        addonBefore={<SearchOutlined/>} placeholder="Быстрый поиск"
                        allowClear
                        value={searchText}
                        onChange={onSearchTextChanged}
                    />
                    { mode === GRID_MODES.delete && renderDeleteModeToolBar() }
                    { mode === GRID_MODES.export && renderExportModeToolBar() }
                    { mode === GRID_MODES.addIssues && renderAddToModeToolBar() }
                    { mode === GRID_MODES.off && renderStandardToolBar()}
                </Space>
            </div>
        </div>
        <RGrid
            onSelectionChanged={onSelectionChanged}
            rowSelection={isMultipleSelection ? 'multiple' : undefined}
            {...props}
            columnDefs={resultCols}
            rowData={list}
            resource={resource}
            quickFilterText={searchText}
            ref={innerGridRef}
            onSortChanged={onSortChanged}
            onRowDoubleClicked={onRowDoubleClicked}
        />
        <div style={{paddingTop: '4px', display: 'flex', justifyContent: 'space-between'}}>
            <Space>
                <Typography.Text>Всего записей: {list.length}</Typography.Text>
            </Space>
            <Space>
                {BottomBar && <BottomBar />}
                <Button icon={<DownloadOutlined/>} onClick={onBtExport}>Скачать .xlsx</Button>
            </Space>
        </div>
    </>;
}