import {
    Form,
    Typography
} from 'antd';
import dayjs from 'dayjs';
import { Days } from 'iso';
import {
    ISSUES,
} from 'iso/src/store/bootstrap';
import {
    roleEnum,
} from 'iso/src/store/bootstrap/repos/users';
import React, {
    useEffect,
    useState
} from 'react';
import { useSelector } from 'react-redux';
import CONTRACTS, { ContractVO } from 'iso/src/store/bootstrap/repos/contracts';

import 'dayjs/locale/ru';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import {
    isManagementRole,
    isUserCustomer
} from '../../../../utils/userUtils';
import FinanceFooter from './FinanceFooter';
import RenField from '../../../form/RenField';
import { useContextEditor } from '../../chapter-modal/useEditor';
import { layoutPropsModalForm } from '../../../form/ModalForm';
// import { statusesList } from 'iso/src/store/bootstrap/repos/issues';
import LEGALS from 'iso/src/store/bootstrap/repos/legals';
import BRANDS from 'iso/src/store/bootstrap/repos/brands';

// const DEFAULT_ISSUE_STATUS = statusesList[0];

const {Text} = Typography;
export default ({newClientsNumber, isEditMode}: {
    newClientsNumber: string,
    isEditMode: boolean
}) => {
    const {currentUser} = useCurrentUser();
    const {role} = currentUser;
    const editor = useContextEditor();
    const contracts: ContractVO[] = useSelector(CONTRACTS.selectList);
    const contract = contracts.find(c => c.contractId === editor.item.contractId);
    const legals = useSelector(LEGALS.selectList);
    const brands = useSelector(BRANDS.selectList);

    const [initRegisterDate, setInitRegisterDate] = useState(editor.item.registerDate);
    const [initValues] = useState({...editor.item});

    useEffect(() => {
        if (!editor.item[ISSUES.clientsNumberProp]) {
            editor.updateItemProperty(ISSUES.clientsNumberProp)(newClientsNumber);
        }

        // fixme: не работает
        // if (!isEditMode && !initValues.status) {
        //     editor.updateItemProperty('status')(DEFAULT_ISSUE_STATUS);
        // }

        // if (isCustomer && !isEditMode) {
        //     editor.updateItemProperty('brandId')(brandId);
        // }
    }, []);

    useEffect(() => {
        if (!isEditMode && !initRegisterDate) {
            const today = dayjs();

            editor.updateItemProperty('registerDate')(today);
            setInitRegisterDate(today);
        }
    }, [initRegisterDate]);

    const isManager = isManagementRole(currentUser);
    const isCustomer = isUserCustomer(currentUser);

    if (isCustomer) {
        const brandId = currentUser.brandId;
        const brandOptions = brands.filter(brand => brand.brandId === brandId).map(brand => ({ label: brand.brandName, value: brand.brandId }));
        const legalOptions = legals.filter(legal => legal.brandId === brandId).map(legal => ({ label: legal.legalName, value: legal.legalId }));

        return (
            <Form
                style={{maxWidth: 800}}
                {...layoutPropsModalForm}
                layout={'horizontal'}
            >
                <RenField meta={ISSUES.properties.clientsIssueNumber}/>
                <RenField meta={ISSUES.properties.brandId} immutable={!!initValues.brandId} customOptions={brandOptions}/>
                <RenField meta={ISSUES.properties.legalId} immutable={!!initValues.legalId} customOptions={legalOptions}/>
                <RenField
                    placeholder={'Адрес не указан'}
                    meta={ISSUES.properties.siteId}
                    immutable={isManager ? false : !!initValues.siteId}
                />
                <RenField defaultValue={dayjs()} meta={ISSUES.fields.registerDate} disabled={!!initRegisterDate}/>
                <RenField meta={ISSUES.properties.plannedDate} disabled width={'sm'}/>
                <RenField meta={ISSUES.properties.workStartedDate} disabled width={'sm'}/>
                <RenField meta={ISSUES.properties.completedDate} disabled width={'sm'}/>
                <RenField
                    meta={ISSUES.properties.description}
                    multiline
                    width={'sm'}
                />
                <RenField meta={ISSUES.properties.clientsEngineerUserId}
                      width={'sm'} defaultValue={currentUser.clientsEngineerUserId} disabled/>
                {isEditMode && (
                    <RenField meta={ISSUES.properties.managerUserId} disabled width={'sm'}/>
                )}
                <RenField meta={ISSUES.properties.status} disabled/>
            </Form>
        );
    }

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
                {/* contactInfo не должно быть видно заказчику */}
                <RenField meta={ISSUES.properties.contactInfo} disabled/>
                <RenField meta={ISSUES.properties.status} disabled/>
            </Form>
        );
    }

    return (
        <Form
            style={{maxWidth: 800}}
            {...layoutPropsModalForm}
            layout={'horizontal'}
        >
            <RenField meta={ISSUES.properties.clientsIssueNumber} disabled={role === roleEnum['сметчик']}/>
            <RenField meta={ISSUES.properties.brandId} immutable={!!initValues.brandId}
                      disabled={!!initValues.brandId}/>
            <RenField meta={ISSUES.properties.legalId} immutable={!!initValues.legalId}
                      disabled={!!initValues.legalId}/>
            <RenField
                style={{minWidth: '350px', maxWidth: '350px'}}
                disabled={!isManager}
                placeholder={'Адрес не указан'}
                meta={ISSUES.properties.siteId}
                immutable={isManager ? false : !!initValues.siteId}
            />
            <Form.Item name="contractId" label="Договор">
                {
                    contract
                        ? <Text type="success">{contract.contractNumber}</Text>
                        : <Text type="warning">Договор не найден</Text>
                }
            </Form.Item>
            <RenField defaultValue={dayjs()} meta={ISSUES.fields.registerDate} disabled={!!initRegisterDate}/>
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
            {!isCustomer && (
                <RenField meta={ISSUES.properties.contactInfo}
                          multiline={true}
                          width={'sm'}/>
            )}
            <RenField meta={ISSUES.properties.status}/>
            <RenField meta={ISSUES.properties.estimationsStatus}
                      width={'sm'}/>
            <RenField meta={ISSUES.properties.dateFR} customProperties={{
                format: Days.FORMAT_MONTH_YEAR,
                picker: 'month',
            }}/>

            <FinanceFooter issue={editor.item}/>
        </Form>);
}