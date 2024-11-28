import Button from "antd/es/button";
import { FC, useState } from "react";
import { AntdIcons } from "../AntdIcons";
import Input from "antd/es/input";
import Form from "antd/es/form";
import { generateNewListItemNumber } from "../../../utils/byQueryGetters";
import SITES, { SiteVO } from "iso/src/store/bootstrap/repos/sites";
import { generateGuid } from "@sha/random";
import { useDispatch } from "react-redux/es/hooks/useDispatch";
import { useSelector } from "react-redux/es/hooks/useSelector";

interface ISimpleCreateSiteButton {
    brandId: string;
    legalId: string;
    managerUserId: string;
    settleOnCreate: (siteId: string) => void;
}

export const SimpleCreateSiteButton: FC<ISimpleCreateSiteButton> = ({ brandId, legalId, managerUserId, settleOnCreate }) => {
    const [isFormMode, setIsFormMode] = useState(false);
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const dispatch = useDispatch();
    const sites = useSelector(SITES.selectList);

    const onSaveSite = async () => {
        const siteId = generateGuid();
        const clientsSiteNumber = generateNewListItemNumber(sites, SITES.clientsNumberProp);

        const newSite: SiteVO = {
            siteId,
            clientsSiteNumber,
            managerUserId,
            brandId,
            legalId,
            city,
            address,
        } as SiteVO;

        const action = SITES.actions.added(newSite);
        dispatch(action);

        settleOnCreate(siteId);
        setIsFormMode(false);
    }
    
    if (!isFormMode) {
        const isAddButtonDisabled = !brandId || !legalId || !managerUserId;

        return (
            <Button
                type="text"
                icon={<AntdIcons.PlusOutlined/>}
                onClick={() => setIsFormMode(true)}
                disabled={isAddButtonDisabled}
            >
                Добавить
            </Button>
        )
    }

    const isSaveButtonDisabled = !city || !address;

    return (
        <>
            <Form.Item label="Город" required>
                <Input value={city} onChange={e => setCity(e.target.value)}/>
            </Form.Item>
            <Form.Item label="Адрес" required>
                <Input value={address} onChange={e => setAddress(e.target.value)}/>
            </Form.Item>
            <Button
                type="text"
                icon={<AntdIcons.PlusOutlined/>}
                onClick={onSaveSite}
                disabled={isSaveButtonDisabled}
            >
                Сохранить
            </Button>
        </>
    )
}