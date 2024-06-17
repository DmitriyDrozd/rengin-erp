import { GridApi } from 'ag-grid-community';
import { RowDoubleClickedEvent } from 'ag-grid-community/dist/lib/events';
import { AgGridReact } from 'ag-grid-react';
import { roleEnum } from 'iso/src/store/bootstrap/repos/users';
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
    ReactElement,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { AntdIcons } from '../components/elements/AntdIcons';
import DeleteButton from '../components/elements/DeleteButton';
import CancelButton from '../components/elements/CancelButton';
import useRole from '../hooks/useRole';


const getItems = (
    isExportAvailable: boolean,
    isAddItemsAvailable: boolean,
    isRemoveItemsAvailable: boolean,
    isDeleteAvailable = true,
    isSelectRowsAvailable = false
): MenuProps['items'] =>
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
            label: 'Добавить к',
            icon: <AntdIcons.PlusCircleOutlined/>,
            key: GRID_MODES.settleItems,
        },
        isRemoveItemsAvailable &&
        {
            label: 'Удалить из',
            icon: <AntdIcons.MinusCircleOutlined/>,
            key: GRID_MODES.unsettleItems,
        },
        isExportAvailable &&
        {
            label: 'Экспортировать записи',
            icon: <AntdIcons.FileZipOutlined/>,
            key: GRID_MODES.export,
        },
        isSelectRowsAvailable && {
            label: 'Выбрать несколько',
            icon: <AntdIcons.CheckSquareOutlined/>,
            key: GRID_MODES.selectRows,
        },
        isDeleteAvailable &&
        {
            type: 'divider'
        },
        isDeleteAvailable &&
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
    settleItems: 'settleItems',
    unsettleItems: 'unsettleItems',
    selectRows: 'selectRows',
};

const GRID_MODES_LIST = [
    GRID_MODES.off,
    GRID_MODES.delete,
    GRID_MODES.export,
    GRID_MODES.settleItems,
    GRID_MODES.unsettleItems,
    GRID_MODES.selectRows,
];

const EDITABLE_CELLS_ID = [
    'status',
    'estimationsStatus',
];

export const getDisplayedGridRows = (api) => {
    const {rowsToDisplay} = api.getModel();
    return rowsToDisplay.map(r => r.data);
}

export default <RID extends string, Fields extends AnyFieldsMeta>(
    {
        isCreateButtonDisabled,
        isNotRoleSensitive,
        name,
        title,
        gridRef,
        BottomBar,
        toolbar,
        columnDefs,
        resource,
        rowData,
        createItemProps,
        onFilterChanged,
        onExportArchive,
        onAddToItems,
        onRemoveFromItems,
        onShowAllItems,
        onCancelClick,
        selectRowsProps,
        ...props
    }: RGridProps<RID, Fields> & {
        isCreateButtonDisabled?: boolean,
        isNotRoleSensitive?: boolean,
        name?: string,
        title: string;
        toolbar?: React.ReactNode,
        BottomBar?: BottomGridApiBar
        gridRef?: React.RefObject<AgGridReact>,
        onFilterChanged?({api}: { api: GridApi }): void;
        onExportArchive?(selectedIds: string[]): void,
        onAddToItems?(selectedIds: string[], updateCollection: (items: any[]) => void): void,
        onRemoveFromItems?(selectedIds: string[], updateCollection: (items: any[]) => void): void,
        onShowAllItems?(): void,
        onCancelClick?(): void,
        selectRowsProps?: { icon: ReactElement, onClick(selectedIds: string[]): void, label: string },
    }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [mode, setMode] = useState(GRID_MODES.off);
    const resetMode = () => {
        setMode(GRID_MODES.off);
        onCancelClick?.();
    };

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

        if (key === GRID_MODES.settleItems) {
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
    };

    const onRemoveFromItemsHandler = () => {
        const getAction = (items) => resource.actions.updatedBatch(items);

        onRemoveFromItems(selectedIds, (items) => dispatch(getAction(items)));
        setSelectedIds([]);
        resetMode();
    };

    const innerGridRef = gridRef || useRef<AgGridReact>(null);

    /**
     * Сохранение состояния таблицы
     */
    const [columnState, setColumnState] = useLocalStorageState((name || title) + 'ColumnState', null);
    const [isColumnStateInitialized, setIsColumnStateInitialized] = useState(!columnState);

    useEffect(() => {
        if (innerGridRef.current && innerGridRef.current.columnApi && !isColumnStateInitialized) {
            innerGridRef.current.columnApi.applyColumnState({state: columnState, applyOrder: true});

            setTimeout(() => {
                setIsColumnStateInitialized(true);
            }, 200);
        }
    }, [innerGridRef.current, isColumnStateInitialized]);

    const onSortChanged = useCallback((ag: any) => {
        if (!isColumnStateInitialized) {
            return;
        }

        setColumnState(ag.columnApi.getColumnState());
    }, [isColumnStateInitialized]);

    const onRowDoubleClicked = (e: RowDoubleClickedEvent) => {
        const cellIds = e.eventPath.slice(0, 5).map(node => node.getAttribute('col-id')).filter(i => !!i);

        if (cellIds.some(cellId => EDITABLE_CELLS_ID.includes(cellId))) {
            return;
        }

        const url = getCrudPathname(resource).edit(e.data[resource.idProp]);
        history.push(url);
    };

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
        );
    };

    const ModeToolBar = ({icon, onClick, label}) => (
        <>
            <Button
                icon={icon}
                disabled={selectedIds.length === 0}
                onClick={onClick}
            >
                {label}
            </Button>
            <CancelButton onCancel={resetMode}/>
        </>
    );


    const renderAddToModeToolBar = () => {
        return (
            <ModeToolBar
                icon={<AntdIcons.PlusCircleFilled/>}
                onClick={onAddToItemsHandler}
                label="Добавить к записям"
            />
        );
    };

    const renderRemoveFromModeToolBar = () => {
        return (
            <ModeToolBar
                icon={<AntdIcons.MinusCircleFilled/>}
                onClick={onRemoveFromItemsHandler}
                label="Удалить из записей"
            />
        );
    };

    const renderSelectRowsModeToolBar = () => {
        if (!selectRowsProps) {
            return null;
        }

        const onClickHandler = () => {
            selectRowsProps.onClick(selectedIds);
            setSelectedIds([]);
            resetMode();
        };

        return (
            <ModeToolBar
                icon={selectRowsProps.icon}
                onClick={onClickHandler}
                label={selectRowsProps.label}
            />
        );
    };

    const role = useRole();

    const renderStandardToolBar = () => {
        const menuItems = getItems(!!onExportArchive, !!onAddToItems, !!onRemoveFromItems, !isNotRoleSensitive, !!selectRowsProps);
        const estimatorMenuItems = getItems(!!onExportArchive, false, false, false, false);
        const getDropdownMenu = (ddMenuItems) => (
            <Dropdown menu={{
                items: ddMenuItems,
                onClick: e => {
                    onMenuClick(e.key);
                }
            }}>
                <Button icon={<AntdIcons.SettingOutlined/>} type={'text'}/>
            </Dropdown>
        );

        const fullToolBar = (
            <>
                {!isCreateButtonDisabled && (
                    <CrudCreateButton resource={resource} defaultProps={createItemProps}/>
                )}
                {getDropdownMenu(menuItems)}
            </>
        );

        if (isNotRoleSensitive) {
            return fullToolBar;
        }

        switch (role) {
            case roleEnum['сметчик']: {

                return (
                    <>
                        <Typography.Text>Вы можете редактировать сметы</Typography.Text>
                        {getDropdownMenu(estimatorMenuItems)}
                    </>
                );
            }
            case roleEnum['инженер']: {
                return (<Typography.Text>Вы можете просматривать {resource.langRU.plural}</Typography.Text>);
            }
            default: {
                return fullToolBar;
            }
        }
    };

    const onBtExport = useCallback(() => {
        innerGridRef.current!.api.exportDataAsExcel();
    }, []);

    const [displayedItemsCount, setDisplayedItemsCount] = useState(list.length);

    return <>
        <div
            style={{
                height: '48px',
                boxShadow: '0 1px 4px rgba(0,21,41,.12)',
                padding: '8px 20px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <Typography.Title level={4} style={{whiteSpace: 'nowrap', margin: '0'}}>{title}</Typography.Title>
            {
                toolbar
            }
            <div style={{display: 'flex'}}>
                <Space>
                    <Typography.Text>Отображено
                        записей: {displayedItemsCount < list.length ? `${displayedItemsCount} из ${list.length}` : list.length}</Typography.Text>
                    <Input
                        style={{maxWidth: '250px', marginRight: '16px', lineHeight: 'unset'}}
                        addonBefore={<SearchOutlined/>} placeholder="Быстрый поиск"
                        allowClear
                        value={searchText}
                        onChange={onSearchTextChanged}
                    />
                    {mode === GRID_MODES.delete && renderDeleteModeToolBar()}
                    {mode === GRID_MODES.export && renderExportModeToolBar()}
                    {mode === GRID_MODES.settleItems && renderAddToModeToolBar()}
                    {mode === GRID_MODES.unsettleItems && renderRemoveFromModeToolBar()}
                    {mode === GRID_MODES.selectRows && renderSelectRowsModeToolBar()}
                    {mode === GRID_MODES.off && renderStandardToolBar()}
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
            cacheQuickFilter
            ref={innerGridRef}
            onSortChanged={onSortChanged}
            onFilterChanged={({ api }) => {
                const { rowsToDisplay } = api.getModel();
                setDisplayedItemsCount(rowsToDisplay.length);

                onFilterChanged?.({ api });
            }}
            onRowDoubleClicked={onRowDoubleClicked}
            /** Displayed rows have changed. Triggered after sort, filter or tree expand / collapse events. */
            // onModelUpdated 
        />
        <div style={{padding: '4px 20px', display: 'flex', justifyContent: 'space-between'}}>
            <Space>
                {
                    selectedIds.length > 0 && (
                        <Typography.Text>Выбрано записей: {selectedIds.length}</Typography.Text>
                    )
                }
            </Space>
            <Space>
                {BottomBar && <BottomBar/>}
                <Button icon={<DownloadOutlined/>} onClick={onBtExport}>Скачать .xlsx</Button>
            </Space>
        </div>
    </>;
}