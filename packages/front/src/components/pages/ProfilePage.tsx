import AppLayout from '../app/AppLayout'
import { NotificationsList } from '../elements/NotificationsList';

export default () => {
    return (
        <AppLayout title="Уведомления">
            <NotificationsList />
        </AppLayout>
    );
}
