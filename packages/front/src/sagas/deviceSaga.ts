import {put} from 'typed-redux-saga';
import {uiDuck} from '../store/ducks/uiDuck';

function is_touch_enabled() {
    return ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);
}

export default function* deviceSaga() {
    yield* put(uiDuck.actions.setDeviceInfo({
        isTouchEnabled: true//is_touch_enabled()
    }))
}
