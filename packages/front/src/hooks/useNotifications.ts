import useFrontSelector from './common/useFrontSelector';
import NOTIFICATIONS, { NotificationStatus, NotificationVO } from 'iso/src/store/bootstrap/repos/notifications';
import { useDispatch } from 'react-redux/es/hooks/useDispatch';
import { generateGuid } from '@sha/random';
import useCurrentUser from './useCurrentUser';

export const useNotifications = (userId?: string) => {
    const dispatch = useDispatch();
    const { currentUser } = useCurrentUser();
    const currentUserId = userId || currentUser.userId;
    const userNotifications: NotificationVO[] = useFrontSelector(NOTIFICATIONS.selectEq({ createdBy: currentUserId }));
    const pendingNotifications = userNotifications.filter(n => n.status === NotificationStatus.pending);

    /**
     * Подготовить уведомление к отправке
     * @param notification 
     */
    const createNotification = (notification: Partial<NotificationVO>) => {
        const created: NotificationVO = {
            createdBy: currentUser.userId,
            timestamp: new Date(),
            createdLink: location.pathname + location.hash,
            ...notification, 
            status: NotificationStatus.pending, 
            [NOTIFICATIONS.idProp]: generateGuid() 
        } as NotificationVO;

        dispatch(NOTIFICATIONS.actions.added(created));
    };

    /**
     * Подготовить несколько уведомлений к отправке
     * @param notifications 
     */
    const createNotifications = (notifications: Partial<NotificationVO>[]) => {
        const created: NotificationVO[] = notifications.map(n => ({
            createdBy: currentUser.userId,
            timestamp: new Date(),
            ...n, 
            status: NotificationStatus.pending, 
            [NOTIFICATIONS.idProp]: generateGuid() 
        })) as  NotificationVO[];

        dispatch(NOTIFICATIONS.actions.addedBatch(created));
    }

    /**
     * Отправить все уведомления, готовые к отправке
     */
    const sendAllPending = () => {
        if (pendingNotifications.length === 0) {
            return;
        } 

        const readyToGo = pendingNotifications.map(n => ({ ...n, status: NotificationStatus.new }));
        dispatch(NOTIFICATIONS.actions.updatedBatch(readyToGo));
    };

    /**
     * Отменить отправку готовых уведомлений
     */
    const discardAllPending = () => {
        if (pendingNotifications.length === 0) {
            return;
        } 
        
        const toDelete = pendingNotifications.map(n => n.notificationId);
        dispatch(NOTIFICATIONS.actions.removedBatch(toDelete));
    }

    const discardSingle = (query: { [queryKey: string]: any }) => {
        const queryKey = Object.keys(query)[0];
        const toDelete = userNotifications.filter(n => n.createdBy === userId && n[queryKey] === query[queryKey]).map(n => n.notificationId);
        
        // removedBatch т.к. одно и то же уведомление могло предназначаться нескольким адресатам
        dispatch(NOTIFICATIONS.actions.removedBatch(toDelete));
    }

    /**
     * Отправить уведомление
     * @param notification 
     */
    const sendNotification = (notification: NotificationVO) => {
        dispatch(NOTIFICATIONS.actions.added({ ...notification, status: NotificationStatus.new, [NOTIFICATIONS.idProp]: generateGuid() }));
    }

    /**
     * Отметить уведомление(я) как прочтенное(ые)
     * @param notification 
     */
    const markAsRead = (notification: NotificationVO | NotificationVO[]) => {
        if (Array.isArray(notification)) {
            dispatch(NOTIFICATIONS.actions.patchedBatch(notification.map(n => ({ ...n, status: NotificationStatus.done }))));
        } else {
            dispatch(NOTIFICATIONS.actions.patched({ ...notification, status: NotificationStatus.done }));
        }
    }

    return {
        userNotifications,
        createNotification,
        createNotifications,
        discardAllPending,
        sendAllPending,
        discardSingle,
        sendNotification,
        markAsRead,
    }
}
