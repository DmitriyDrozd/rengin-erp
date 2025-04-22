import { UserVO } from 'iso/src/store/bootstrap/repos/users';
import useFrontSelector from './common/useFrontSelector';
import {selectCurrentUser, selectUserNotifications, selectUsersHeadOfUnit} from '../store/frontReducer';
import { NotificationStatus, NotificationVO } from 'iso/src/store/bootstrap/repos/notifications';

export default (): { currentUser: UserVO, notifications: NotificationVO[], newNotifications: NotificationVO[], headOfUnitId: string | null } => {
    const currentUser = useFrontSelector(selectCurrentUser) as UserVO;
    const headOfUnitId = useFrontSelector(selectUsersHeadOfUnit(currentUser.userId));
    const notifications = useFrontSelector(selectUserNotifications(currentUser.userId)) as NotificationVO[];
    const newNotifications = notifications.filter(n => n.status === NotificationStatus.new);

    return {
        currentUser,
        headOfUnitId,
        notifications,
        newNotifications,
    }
}
