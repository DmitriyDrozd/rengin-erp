import {WithValueProps} from '@sha/react-fp'
import {UserVO} from 'iso/src/store/bootstrap/repos/user-schema'
import {Button, Form, Input, Select, Space} from 'antd'
import useUser from '../../hooks/useUser'
import {useEffect, useState} from 'react'
import {key} from 'ionicons/icons'
import { useForm } from "react-hook-form";
import EditorFooter from './EditorFooter'
import {FieldRender} from '../grid/createColumns'
import {AddressVO} from 'iso/src/store/bootstrap/repos/addresses-schema'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { DevTool } from "@hookform/devtools";
import {AntReactHookFormItem} from './AntReactHookFormItem'
import {ContractVO} from 'iso/src/store/bootstrap/repos/contracts-schema'
import useLedger from '../../hooks/useLedger'
import {uniq} from 'ramda'

export default ({item, onCancel, onSave,isNew}:{item: Partial<ContractVO>,isNew?:boolean, onCancel: Function, onSave: (item: ContractVO) => any}) => {

    const [state, setState] = useState(item)
    const onPropChanged = <K extends keyof ContractVO>(prop: K) => (d: ContractVO[K]) => {
        console.log('onPropChanged', prop, d)
        setState({...state, [prop]: d})
    }

    const onOk = () => {

        onSave(state)
    }




    const ledger = useLedger()
    const brands = uniq(ledger.addresses.map(a => a.brand))

    console.log('cuurentalues',state)
    const allAddresses = ledger.addresses
    const inBrandAddresses = allAddresses.filter(a => a.brand === state.brand)
    const companies= uniq(inBrandAddresses.map(c => c.companyName))
    console.log(allAddresses,inBrandAddresses)
    console.log('companies',companies)
        return [<Form     labelCol={{ span: 4 }}
                      wrapperCol={{ span: 14 }}
                      layout="horizontal" >
        <Form.Item label="Номер договора" name={'legalNumber'} >
            <Input value={state.legalNumber} onChange={e=> onPropChanged('legalNumber')(e.target.value)} />
        </Form.Item>

        <Form.Item label="Заказчик" name={'brand'} >
            <Select
                showSearch
                value={state.brand}
                onSelect={e => onPropChanged('brand')(e)}
                style={{ width: 200 }}
                placeholder="Начните вводить заказчика"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={brands.map(b => ({label: b, value: b}))}
            />
        </Form.Item>
        <Form.Item label="Юр. Лицо" name={'companyName'}>
            <Select
                value={state.companyName}
                onSelect={e => onPropChanged('companyName')(e)}
                showSearch
                style={{ width: 200 }}
                placeholder="Начните вводить юр лицо"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={companies.map(b => ({label: b, value: b}))}
            />
        </Form.Item>

        <EditorFooter onCancel={onCancel} onSave={() =>onOk(state)} saveText={isNew ? 'Создать' : 'Сохранить'} />


    </Form>,     ]

}