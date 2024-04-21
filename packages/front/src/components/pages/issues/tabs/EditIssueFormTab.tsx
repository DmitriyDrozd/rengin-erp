import {
    Form,
    Typography
} from 'antd';
import dayjs from 'dayjs';
import { ISSUES } from 'iso/src/store/bootstrap';
import { roleEnum } from 'iso/src/store/bootstrap/repos/users';
import React, {
    useEffect,
    useState
} from 'react';
import { useSelector } from 'react-redux';
import CONTRACTS, { ContractVO } from 'iso/src/store/bootstrap/repos/contracts';

import 'dayjs/locale/ru';
import useRole from '../../../../hooks/useRole';
import FinanceFooter from './FinanceFooter';
import RenField from '../../../form/RenField';
import { useContextEditor } from '../../chapter-modal/useEditor';
import { layoutPropsModalForm } from '../../../form/ModalForm';

const {Text} = Typography;
export default ({ newClientsNumber, isEditMode }: { newClientsNumber: string, isEditMode: boolean }) => {
    const role = useRole();
    const editor = useContextEditor();
    const contracts: ContractVO[] = useSelector(CONTRACTS.selectList);
    const contract = contracts.find(c => c.contractId === editor.item.contractId);

    const [initRegisterDate, setInitRegisterDate] = useState(editor.item.registerDate);

    useEffect(() => {
        if (!editor.item[ISSUES.clientsNumberProp]) {
            editor.updateItemProperty(ISSUES.clientsNumberProp)(newClientsNumber);
        }

        if (!isEditMode && !initRegisterDate) {
            const today = dayjs();

            editor.updateItemProperty('registerDate')(today);
            setInitRegisterDate(today);
        }
    }, [initRegisterDate]);

    if (role === roleEnum['инженер']) {
        return (
            <Form
                style={{maxWidth: 800}}
                {...layoutPropsModalForm}
                layout={'horizontal'}
            >
                <RenField meta={ISSUES.properties.clientsIssueNumber} disabled/>
                <RenField
                    meta={ISSUES.properties.description}
                    multiline
                    disabled
                    width={'sm'}
                />
                <RenField meta={ISSUES.properties.contactInfo} disabled/>
                <RenField meta={ISSUES.properties.status} disabled/>
            </Form>
        )
    }

    return (
        <Form
            style={{maxWidth: 800}}
            {...layoutPropsModalForm}
            layout={'horizontal'}
        >
            <RenField meta={ISSUES.properties.clientsIssueNumber}/>
            <RenField meta={ISSUES.properties.brandId}/>
            <RenField meta={ISSUES.properties.legalId}/>
            <RenField
                style={{minWidth: '350px', maxWidth: '350px'}}
                disabled={role !== 'руководитель'}
                placeholder={'Адрес не указан'}
                meta={ISSUES.properties.siteId}
            />
            <Form.Item name="contractId" label="Договор">
                {
                    contract
                        ? <Text type="success">{contract.contractNumber}</Text>
                        : <Text type="warning">Договор не найден</Text>
                }
            </Form.Item>
            <RenField defaultValue={dayjs()} meta={ISSUES.fields.registerDate} disabled={!!initRegisterDate} />
            <RenField meta={ISSUES.properties.plannedDate} disabled={role === 'сметчик' || role === 'менеджер'}
                      width={'sm'}/>
            <RenField meta={ISSUES.properties.workStartedDate} disabled={role === 'сметчик' || role === 'менеджер'}
                      width={'sm'}/>
            <RenField meta={ISSUES.properties.completedDate} disabled={role === 'сметчик' || role === 'менеджер'}
                      width={'sm'}/>
            <RenField meta={ISSUES.properties.description}
                      multiline={true}
                      disabled={role === 'сметчик'}
                      width={'sm'}/>
            <RenField meta={ISSUES.properties.managerUserId}
                      disabled={role === 'сметчик'}
                      width={'sm'}/>
            <RenField meta={ISSUES.properties.clientsEngineerUserId}
                      width={'sm'}/>
            <RenField meta={ISSUES.properties.techUserId}
                      width={'sm'}/>
            <RenField meta={ISSUES.properties.estimatorUserId}
                      width={'sm'}/>
            <RenField meta={ISSUES.properties.contactInfo}
                      multiline={true}
                      width={'sm'}/>
            <RenField meta={ISSUES.properties.status}/>
            <RenField meta={ISSUES.properties.estimationsStatus}
                      width={'sm'}/>

            <FinanceFooter issue={editor.item}/>
        </Form>);
}