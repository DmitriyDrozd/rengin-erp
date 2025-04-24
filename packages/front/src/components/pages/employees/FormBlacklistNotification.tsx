import Form from "antd/es/form";
import Tag from "antd/es/tag";
import { EMPLOYEES } from "iso/src/store/bootstrap/repos/employees";
import { FC } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { isEmployeeBlacklisted } from "../../../utils/userUtils";
import ExclamationCircleOutlined from "@ant-design/icons/lib/icons/ExclamationCircleOutlined";
import { Link } from 'react-router-dom';
import { getNav } from "../../getNav";
import Space from "antd/es/space";

interface FormBlacklistNotificationProps {
    techUserId?: string;
    paddingLeft?: string;
}

export const FormBlacklistNotification: FC<FormBlacklistNotificationProps> = ({ techUserId, paddingLeft = '25%' }) => {
    const techUser = useSelector(EMPLOYEES.selectById(techUserId));
    const blacklistNotification = isEmployeeBlacklisted(techUser) ? (
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
            Внимание! Специалист находится в <Link to={getNav().employeesEditBlacklist({ employeeId: `#${techUserId}` })}>чёрном списке</Link>
        </Tag>
    ) : null;

    if (!blacklistNotification) {
        return null;
    }

    return (
        <Space style={{ paddingLeft, paddingTop: 10, paddingBottom: 10 }}>
            {blacklistNotification}
        </Space>
    ) 
}