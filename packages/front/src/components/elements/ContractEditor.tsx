import {Form, Input, Select} from 'antd'
import {useState} from 'react'
import EditorFooter from './EditorFooter'
import {ContractVO} from 'iso/src/store/bootstrap/repos/contracts'
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