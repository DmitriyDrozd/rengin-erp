import {useDispatch, useSelector} from "react-redux";
import {ISSUES} from "iso/src/store/bootstrap";
import {useMemo, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {ColDef, RowEditingStartedEvent, RowEditingStoppedEvent, StatusPanelDef} from "ag-grid-community";
import {EstimationItem, ExpenseItem, IssueVO} from "iso/src/store/bootstrap/repos/issues";
import {Button, Space, Typography} from "antd";
import {clone, remove} from "ramda";
import useIssue from "../../../../contexts/useIssue";
import AG_GRID_LOCALE_RU from "../../../../grid/locale.ru";
import ImportTableButton from "../ImportTableButton";

const countEstimations = (expenses: IssueVO['estimations']) =>
        expenses.reduce((prev, item)=> prev+(isNaN(Number(item.amount)) ? 0: Number(item.amount)), 0)

export default () => {
    const {issue,setIssue,setIssueProperty} = useIssue()
    const issueId = issue.issueId

    const initialItems= clone(issue.estimations || [])
    const [isEdited, setIsEdited] = useState(false)
    const gridRef = useRef<AgGridReact>(null);
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '300px', width: '100%' }), []);
    const rowData = initialItems
    console.log('ExpensesTable issue', issue)
    const setRowData = (items: ExpenseItem[]) => {
        setIssue({...issue, estimations: items, estimationPrice: countEstimations(items)})
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
            cellRenderer: (props:{rowIndex:number}) =>
                <Button danger={true} onClick={() => {
                   setRowData(remove(props.rowIndex,1,rowData))
                }}>Удалить</Button>
        }
    ]


    const xlsxCols = columnDefs.filter(def => def.field).map(def => def.field)
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            flex: 1,
            minWidth: 110,
            editable: true,
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

    return <div>
        <div className="ag-theme-alpine" style={gridStyle}>
            <AgGridReact
                localeText={AG_GRID_LOCALE_RU}
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                onCellEditingStarted={onCellEditingStarted}
                onCellEditingStopped={onCellEditingStopped}
            />

        </div>

        <div style={{paddingTop: '8px'}}>
            <Space>
                <ImportTableButton<ExpenseItem>
                    onImport={onImport}
                    sampleFileURL={'/assets/import-estimations-example.xlsx'}
                    xlsxCols={xlsxCols}
                    title={"Импорт сметы"}
                    imgURL={'/assets/import-estimations-example.png'}
                    importedItemsFound={"позиций в смете"}
                ></ImportTableButton>

                <Button type={"primary"} onClick={() => setRowData([...rowData,{}])}>Добавить строку</Button>
                <Typography.Text>Итого: </Typography.Text>
                <Typography.Text code strong>{issue.estimationPrice}</Typography.Text>
            </Space>
        </div>
    </div>
}

