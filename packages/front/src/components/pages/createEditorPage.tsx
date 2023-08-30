import React from 'react'
import {ItemEditor} from '../elements/UserEditor'
import useSaveItem from '../../hooks/useSaveItem'
import {useHistory} from 'react-router'
import InnerPageBase from '../layout/InnerPageBase'
import {Breadcrumb} from 'antd'
import {Link} from 'react-router-dom'
import {AntdIcons} from '../elements/AntdIcons'
import {AnyFieldsMeta, Resource} from 'iso/src/store/bootstrap/core/createResource'

export const createEditorPage = <RID extends string,F extends AnyFieldsMeta>({crud,icon,Editor}: {crud: Resource<RID,F>, icon: React.ReactNode, Editor:ItemEditor<T>  }) =>
    ({id}: {id: string}) => {


        type Item = typeof crud.exampleItem
        const [item, saveItem] = useSaveItem<Item>(crud, id)

        const history = useHistory()

        const onSubmit = (item: Item) => {
            saveItem(item)
            history.push('/app/in/'+crud.factoryPrefix)
        }

        return   <InnerPageBase>
            <Breadcrumb style={{ margin: '16px 0' }}
                        items={[
                            {

                                title:  <Link to={'/app/in/start'}><AntdIcons.HomeOutlined /></Link>,
                            },
                            {

                                title: (
                                    <Link to={'/app/in/'+crud.factoryPrefix}>
                                        {icon}
                                        <span>{crud.langRU.plural}</span>
                                    </Link>
                                ),
                            },
                            {
                                title: id === 'new' ? 'Новая запись' : crud.getItemName(item),
                            },
                        ]}
            >
            </Breadcrumb>
            <Editor item={item} onCancel={() => history.push('/app/in/'+crud.factoryPrefix)} onSave={onSubmit} isNew={id==='new'}/>
        </InnerPageBase>
    }