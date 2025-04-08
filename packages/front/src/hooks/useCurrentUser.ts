import { UserVO } from 'iso/src/store/bootstrap/repos/users';
import useFrontSelector from './common/useFrontSelector';
import {selectCurrentUser, selectUserNotifications} from '../store/frontReducer';
import { NotificationStatus, NotificationVO } from 'iso/src/store/bootstrap/repos/notifications';

export default (): { currentUser: UserVO, notifications: NotificationVO[], newNotifications: NotificationVO[] } => {
    const currentUser = useFrontSelector(selectCurrentUser) as UserVO;
    const notifications = useFrontSelector(selectUserNotifications(currentUser.userId)) as NotificationVO[];
    const newNotifications = notifications.filter(n => n.status === NotificationStatus.new);

    return {
        currentUser,
        notifications,
        newNotifications,
    }
}
