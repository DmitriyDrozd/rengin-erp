import {useSelector} from "react-redux";
import {uiDuck, UIState} from "../../store/ducks/uiDuck";

export default () => {
    const state: UIState = useSelector(uiDuck.selectUI)
    return state

}
