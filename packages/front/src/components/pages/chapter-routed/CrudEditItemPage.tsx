import {
    AnyFieldsMeta,
    Resource
} from 'iso/src/store/bootstrap/core/createResource';
import { useDispatch } from 'react-redux';
import React, {
    useRef,
    useState
} from 'react';
import AppLayout from '../../app/AppLayout';
import { ProFormInstance } from '@ant-design/pro-components';
import { ItemChapterProps } from './ItemChapter';
import getCrudPathname from '../../../hooks/getCrudPathname';
import { RForm } from '../../elements/RForm';
import { useHistory } from 'react-router';
import { AntdIcons } from '../../elements/AntdIcons';
import {
    Breadcrumb,
    Button
} from 'antd';
import DeleteButton from '../../elements/DeleteButton';
import CancelButton from '../../elements/CancelButton';


export type CrudFormRenderProps<
    RID extends string,
    Fields extends AnyFieldsMeta,
> = ItemChapterProps<RID, Fields> & {
    item: Partial<Resource<RID, Fields>['exampleItem']>
    id: string
    verb: 'EDIT' | 'CREATE' | 'VIEW'
}


export const CrudEditItemPage = <
    RID extends string,
    Fields extends AnyFieldsMeta,
>(props: CrudFormRenderProps<RID, Fields>) => {
    const {resource, renderForm, item, renderItemInfo, verb, renderList, id} = props;

    type Item = typeof resource.exampleItem
    const formRef = useRef<
        ProFormInstance<Item>
    >();

    const idProp = resource.idProp;
    const initialValues = item;
    const dispatch = useDispatch();
    const history = useHistory();
    const [state, setState] = useState(initialValues);
    const onSubmit = async (values: Item) => {

        const patch = {...initialValues, ...values, [idProp]: id};
        const action = resource.actions.patched(patch, initialValues);
        history.goBack();
        if (action)
            dispatch(action);
    };
    const title = resource.getItemName(state);
    const onSave = () => {
        formRef.current?.submit();
    };
    const onDelete = () => {
        dispatch(resource.actions.removed(id));
        onBack();
    };
    const layoutProps = {
        labelCol: {span: 6},
        wrapperCol: {span: 18},
    };
    const onBack = () =>
        history.goBack();
    return (
        <AppLayout
            proLayout={{
                extra: [
                    <CancelButton onCancel={onBack}/>,
                    <DeleteButton resource={resource} id={id} onDeleted={onDelete}/>,
                    <Button type={'primary'} icon={<AntdIcons.SaveOutlined/>} onClick={onSave}>Сохранить</Button>
                ],
                title,
            }}
            onBack={onBack}

            title={(
                <Breadcrumb items={[
                    {
                        href: getCrudPathname(resource).view(),
                        title: resource.langRU.plural
                    },
                    {
                        title,
                    }
                ]} />
            )}>

            <RForm<Item>
                layout={'horizontal'}
                {
                    ...layoutProps
                }
                formRef={formRef}
                readonly={false}
                initialValues={initialValues}
                onValuesChange={(_, values) => {
                    console.log(values);
                    setState(values);
                }}
                onFinish={async (values) => {
                    onSubmit(values);
                }}
                onReset={onBack}
                submitter={{
                    render: (props) => null
                }}
            >
                {
                    renderForm({resource, item: state, id, verb, renderItemInfo})
                }
            </RForm>
            {
                renderItemInfo && renderItemInfo({...props, item})
            }
        </AppLayout>
    );
};

