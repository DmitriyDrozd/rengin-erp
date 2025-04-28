import { ColDef } from 'ag-grid-community';
import { RESOURCES_MAP } from 'iso/src/store/bootstrap/resourcesList';
import ItemChapter, { fieldMetaToProProps } from '../chapter-routed/ItemChapter';
import {
    ProFormSelect,
    ProFormText
} from '@ant-design/pro-components';
import { useAllColumns } from '../../../grid/RCol';
import useLedger from '../../../hooks/useLedger';
import PanelRGrid from '../../../grid/PanelRGrid';
import LIST_WORK_TYPES, { WorkTypeVO } from 'iso/src/store/bootstrap/repos/listWorkTypes';

const WorkTypesChapter = () => {
    const ledger = useLedger();
    const list = ledger.workTypes;
    const [cols, colMap] = useAllColumns(LIST_WORK_TYPES);

    const columns: ColDef<WorkTypeVO>[] = [
        {...colMap.clickToEditCol, headerName: 'id'},
        {...colMap.title, width: 500},
    ];

    return (
        <ItemChapter
            resource={RESOURCES_MAP.LIST_WORK_TYPES}
            renderForm={({item, verb}) =>
                <>
                    <ProFormText {...fieldMetaToProProps(LIST_WORK_TYPES, 'title', item)} rules={[{required: true}]}/>
                </>
            }
            renderList={() => {
                return (
                    <PanelRGrid
                        columnDefs={columns}
                        fullHeight={true}
                        title={'Типы работ'}
                        resource={LIST_WORK_TYPES}
                        rowData={list.list}
                    />
                );
            }}
        />
    );
}

export default WorkTypesChapter;