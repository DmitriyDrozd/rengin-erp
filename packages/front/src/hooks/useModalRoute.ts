import {useIonRouter} from '@ionic/react';
import {useHistory, useLocation} from 'react-router';
import {OverlayEventDetail} from '@ionic/core';
import {IonModalCustomEvent} from '@ionic/core/dist/types/components';

export default (modalRoute, stateKey?: string): [boolean, (event: IonModalCustomEvent<OverlayEventDetail>) => void, (event: IonModalCustomEvent) => void] => {
    const history = useHistory()
    const location = useLocation()
    const [pagePath, modalQuery] = modalRoute.split('?')
    const ionRouter = useIonRouter()

    const isOpen = location.search.startsWith('?' + modalQuery)
    const onWillPresent = (event: IonModalCustomEvent<OverlayEventDetail>) => {
        console.log('onWillPresent', {currentLocation: location}, ionRouter)
        if (location.search !== '?' + modalQuery)
            history.push(modalRoute)
    }

    const onWillDismiss = (event: IonModalCustomEvent<OverlayEventDetail>) => {
        console.log('onDismiss', {currentLocation: location}, ionRouter)

        if (location.search === '?' + modalQuery)
            if (history.length >= 2)
                history.goBack()
            else
                history.replace(pagePath)
    }

    return [isOpen, onWillDismiss, onWillPresent]
}
