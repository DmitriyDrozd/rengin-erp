import { createResource } from '../core/createResource';
import { valueTypes } from '../core/valueTypes';

export const NotificationStatus = {
    new: 'Новая',
    done: 'Просмотрено',
    pending: 'Подготовка к отправке',
}

export const notificationStatusList = [NotificationStatus.new, NotificationStatus.done];

export const NotificationType = {
    default: 'default',
    warning: 'warning',
    error: 'error',
    info: 'info',
    feedback: 'feedback',
}

export const notificationTypeList = [
    NotificationType.default,
    NotificationType.warning,
    NotificationType.error,
    NotificationType.info,
    NotificationType.feedback
];

const notificationsRaw = createResource('notification', {
        clientsNotificationNumber: valueTypes.string({headerName: 'Номер нотификации', select: false, internal: true}),
        title: valueTypes.string({headerName: 'Название'}),
        message: valueTypes.text({headerName: 'Содержимое', required: true}),
        type: valueTypes.enum({headerName: 'Тип', enum: notificationTypeList}),
        
        timestamp: valueTypes.date({headerName: 'Дата создания', required: true}),
        createdBy: valueTypes.string({headerName: 'Автор', required: true}),
        createdLink: valueTypes.string({headerName: 'Ссылка на первоисточник'}),
        
        destination: valueTypes.string({headerName: 'Адресат'}),
        status: valueTypes.enum({headerName: 'Статус', enum: notificationStatusList}),
        
        removed: valueTypes.boolean({select: false, internal: true}),
    },
    {
        nameProp: 'clientsNotificationNumber',
        langRU: {
            singular: 'Уведомление',
            plural: 'Уведомления',
            some: 'Уведомлений'
        }
    }
);

export const notificationResource = {
    ...notificationsRaw,
    clientsNumberProp: 'clientsNotificationNumber',
};

export type NotificationVO = typeof notificationsRaw.exampleItem
export const NOTIFICATIONS = notificationResource;

export default NOTIFICATIONS;
