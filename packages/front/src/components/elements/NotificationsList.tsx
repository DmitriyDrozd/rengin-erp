import Card from "antd/es/card"
import { Col } from "antd/es/grid";
import { Row } from "antd/es/grid";
import { NotificationStatus, NotificationType, NotificationVO } from "iso/src/store/bootstrap/repos/notifications"
import { FC } from "react";
import { Link, useHistory } from 'react-router-dom'
import { useNotifications } from "../../hooks/useNotifications";
import Typography from "antd/es/typography";
import dayjs from "dayjs";
import { GENERAL_DATE_FORMAT } from "iso/src/utils/date-utils";
import { Divider } from "antd";
import useCurrentUser from "../../hooks/useCurrentUser";
import useLedger from "../../hooks/useLedger";
import Badge from "antd/es/badge";
import Empty from "antd/es/empty";
import Button from "antd/es/button";
import message from "antd/es/message";

const doneStyle = {
    opacity: 0.5,
    "&:hover": {
        opacity: 1,
    }
}

const doneWarningStyle = {
    ...doneStyle,
    color: '#fff1f0'
}

const warningStyle = {
    background: '#ffccc7',
}

const defaultStyle = {
}

const styleMap = {
    [NotificationType.default]: {
        [NotificationStatus.new]: defaultStyle,
        [NotificationStatus.done]: doneStyle,
    },
    [NotificationType.warning]: {
        [NotificationStatus.new]: warningStyle,
        [NotificationStatus.done]: doneWarningStyle,
    }
};


interface SingleNotificationProps {
    author: string;
    item: NotificationVO;
    onRead: () => void;
}

const SingleNotification: FC<SingleNotificationProps> = ({ author, item, onRead }) => {
    const createdAtLabel = dayjs(item.timestamp).format(GENERAL_DATE_FORMAT);
    const createdByLabel = author ? `от ${author}, ` : '';

    const style = styleMap[item.type][item.status];
    const isNew = item.status === NotificationStatus.new;
    const badgeLabel = isNew ? 'Новое' : null;

    return (
        <Row gutter={[16,16]} style={{marginBottom: '16px', marginTop: '16px'}}>
            <Col style={{ minWidth: '50%' }}>
                <Badge.Ribbon style={{ visibility: isNew ? 'visible' : 'hidden' }} text={badgeLabel} color="green">
                    <Card
                        hoverable
                        extra={<Typography.Text style={{ paddingRight: 30 }} color="grey">{createdByLabel}{createdAtLabel}</Typography.Text>}
                        onClick={onRead}
                        title={item.title}
                        style={style}
                    >
                        <p>{item.message}</p>
                    </Card>
                </Badge.Ribbon>
            </Col>
        </Row>
    )
}

export const NotificationsList: FC = () => {
    const ledger = useLedger();
    const usersById = ledger.users.byId;
    const getAuthor = (userId: string) => {
        const user = usersById[userId] 
        return user ? `${user.name} ${user.lastname}` : null;
    }

    const { notifications, newNotifications } = useCurrentUser();
    const { markAsRead } = useNotifications();
    const history = useHistory();
    
    const handleReadNotification = (notification: NotificationVO) => () => {
        if (notification.status === NotificationStatus.new) {
            markAsRead(notification);
        }
        
        history.push(notification.createdLink);
    };

    const newNotificationsToDisplay = newNotifications.reverse();
    const readNotificationsToDisplay = notifications.reverse().filter(n => n.status === NotificationStatus.done);

    const [messageApi, contextHolder] = message.useMessage();
    const handleReadAll = () => {
        markAsRead(newNotifications);

        messageApi.open({
          type: 'success',
          content: 'Уведомления отмечены как прочитанные!',
        });
    };

    return (
        <>
            {newNotificationsToDisplay.length === 0 && (
                <Empty
                    description={
                        <Typography.Text>
                            Нет новых уведомлений
                        </Typography.Text>
                    }
                />
            )}
            {newNotificationsToDisplay.length > 0 && (
                <>
                    {contextHolder}
                    <Button onClick={handleReadAll}>Отметить все как прочитанные</Button>
                </>
            )}
            {newNotificationsToDisplay.map((notification, index) => (
                <SingleNotification
                    author={getAuthor(notification.createdBy)}
                    item={notification} 
                    key={index} 
                    onRead={handleReadNotification(notification)} 
                />
            ))}
            {readNotificationsToDisplay.length > 0 && <Divider orientation="left">Прочитанные</Divider>}
            {readNotificationsToDisplay.map((notification, index) => (
                <SingleNotification 
                    author={getAuthor(notification.createdBy)}
                    item={notification} 
                    key={index} 
                    onRead={handleReadNotification(notification)} 
                />)
            )}
        </>
    )
}