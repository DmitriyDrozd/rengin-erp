import {ExpenseItem, TICKETS, TicketVO} from "iso";
import React, {useCallback, useMemo, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";

import {ColDef, RowEditingStartedEvent, RowEditingStoppedEvent} from "ag-grid-community";
import {Button, Space, Typography} from "antd";
import {clone, remove} from "ramda";
import AG_GEID_LOCALE_RU from "../../../../grid/locale.ru";
import ImportTableButton from "../ImportTableButton";
import {DownloadOutlined} from "@ant-design/icons";
import {fieldMetaToProProps} from "../../chapter-routed/ItemChapter";
import RenFormCheckbox from "../../../form/RenFormCheckbox";
import useCurrentUser from "../../../../hooks/useCurrentUser";
import {useContextEditor} from "../../chapter-modal/useEditor";

const countEstimations = (expenses: TicketVO['estimations']) =>
        expenses.reduce((prev, item)=> prev+(isNaN(Number(item.amount)) ? 0: Number(item.amount)), 0)

export default () => {

    const currentUser = useCurrentUser()
    const canEdit = (currentUser.role ==='руководитель' || currentUser.role==='сметчик')
        ? true
        : false
    const editorProps = useContextEditor(TICKETS)
    const {item,params,getRenFieldProps,updateItemProperty,hasChanges,errors,isValid, } = editorProps


    const initialItems= clone(item.estimations || [])
    const [isEdited, setIsEdited] = useState(false)
    const gridRef = useRef<AgGridReact>(null);
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '300px', width: '100%' }), []);
    const rowData = initialItems
    console.log('ExpensesTable issue', item)
    const setRowData = (items: ExpenseItem[]) => {
        updateItemProperty('estimations')(items)//({...item, estimations: items, estimationPrice: countEstimations(items)})
    }

    const columnDefs = [
       /* {
            field: 'paymentType',
            headerName:'Оплата',
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Наличные', 'Безналичные']
            } as ISelectCellEditorParams,

        },*/
        { field: 'title',headerName:'Наименование' },
        { field: 'amount',headerName:'Расходы',cellEditor: 'agNumberCellEditor',
            },
        { field: 'comment',headerName:'Комментарий'},
        {
            cellRenderer: canEdit
                ? (props:{rowIndex:number}) =>
                <Button danger={true} onClick={() => {
                   setRowData(remove(props.rowIndex,1,rowData))
                }}>Удалить</Button>
                : 'Смета'
        }
    ]


    const xlsxCols = columnDefs.filter(def => def.field).map(def => def.field)
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            flex: 1,
            minWidth: 110,
            editable: canEdit,
            resizable: true,
        };
    }, []);

    const onCellEditingStarted = (e:RowEditingStartedEvent) => {
        console.log('RowEditingStartedEvent',e)
    }
    const onCellEditingStopped = (e: RowEditingStoppedEvent) => {
        let items: Array<ExpenseItem> = [];
        gridRef.current.api.forEachNode(function(node) {

            items.push(node.data);
        });
        setRowData(items)
        console.log('RowEditingStoppedEvent',e,items)
    }


    const onImport = async (items: ExpenseItem[]) => {
        console.log('onImport', items)
        setRowData(items)
    }
    const buildCheckbox = (name: keyof TicketVO) => {
        return  <RenFormCheckbox {...fieldMetaToProProps(TICKETS, name, item)}
                                 value={item[name]}
                                 onValueChange={
                                     updateItemProperty(name)
                                 }
                                 disabled={!canEdit}
                                 label={TICKETS.attributes[name].headerName} width={'sm'}
        />
    }
    const onBtExport = useCallback(() => {
        gridRef.current!.api.exportDataAsExcel();
    }, []);

    return <div>{
        canEdit
            ? <Typography.Text type={'success'}> Ваша роль {currentUser.role}, редактируйте смету</Typography.Text>
            : <Typography.Text type={'danger'}>Ваша роль {currentUser.role}, нельзя смету</Typography.Text>
        }
        {
            buildCheckbox('estimationsApproved')
        }
        <div className="ag-theme-alpine" style={gridStyle}>
            <AgGridReact
                localeText={AG_GEID_LOCALE_RU}
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                onCellEditingStarted={onCellEditingStarted}
                onCellEditingStopped={onCellEditingStopped}

            />

        </div>


        <div style={{paddingTop: '8px', display: 'flex', justifyContent:'space-between' }}>
            <Space>
                {canEdit?<> <ImportTableButton<ExpenseItem>
                    onImport={onImport}
                    sampleFileURL={'/assets/import-estimations-example.xlsx'}
                    xlsxCols={xlsxCols}
                    title={"Импорт сметы"}
                    imgURL={'/assets/import-estimations-example.png'}
                    importedItemsFound={"позиций в смете"}
                ></ImportTableButton>

                <Button type={"primary"} onClick={() => setRowData([...rowData,{}])}>Добавить строку</Button></>
                    :<Typography.Text type={'danger'}>Ваша роль {currentUser.role}, нельзя смету</Typography.Text>
            }
                    <Typography.Text>Итого: </Typography.Text>
                <Typography.Text code strong>{item.estimationPrice}</Typography.Text>
            </Space>

            <Space>
                <Button icon={<DownloadOutlined />} onClick={onBtExport} >Скачать .xlsx</Button>
            </Space>
        </div>
    </div>
}

