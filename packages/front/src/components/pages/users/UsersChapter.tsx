import {RESOURCES_MAP} from 'iso/src/store/bootstrap/resourcesList'
import ItemChapter, {fieldMetaToProProps} from '../chapter-routed/ItemChapter'
import {ProFormSelect, ProFormText} from '@ant-design/pro-components'
import {useAllColumns} from '../../../grid/RCol'
import LEGALS from 'iso/src/store/bootstrap/repos/legals'
import useLedger from '../../../hooks/useLedger'
import PanelRGrid from '../../../grid/PanelRGrid'
import {USERS} from "iso/src/store/bootstrap";
import {roleEnum} from "iso/src/store/bootstrap/repos/users";

export default () => {
    const ledger = useLedger()
    const list = ledger.users
    const [cols] = useAllColumns(USERS)



    return <ItemChapter
        resource={RESOURCES_MAP.USERS}

        renderForm={({item, form,id,verb, resource}) =>
            <>
                <ProFormText {...fieldMetaToProProps(USERS, 'fullName', item)} rules={[{required:true}]} />
                <ProFormText {...fieldMetaToProProps(USERS, 'title', item)} rules={[{required:true}]} />
                <ProFormSelect {...fieldMetaToProProps(USERS, 'role',item)} rules={[{required:true}]} valueEnum={roleEnum} />
                <ProFormText {...fieldMetaToProProps(USERS, 'email',item)} rules={[{required:true}]} />
                <ProFormText {...fieldMetaToProProps(USERS, 'password',item)} rules={[{required:true}]} />
            </>
        }
        renderList={({form,verb,resource}) => {
            return  <PanelRGrid
                fullHeight={true}
                title={'Пользователи'}
                resource={USERS}

                rowData={list}
            />
        }}
    />
}