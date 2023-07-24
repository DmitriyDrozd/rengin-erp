import useFrontSelector from "./common/useFrontSelector";
import {uiDuck} from "../store/ducks/uiDuck";
import {useProject} from "./useProject";
import {equals, flatten, uniq} from "ramda";
import useStatuses from "./useStatuses";
import {StoneStatus} from "iso/src/store/bootstrap/StatusesMatrix";
import {StoneVO} from "iso/src/store/bootstrap/repos/projectsCURD";
import useRole from "./useRole";
import {useDispatch} from "react-redux";

export type StatusTransition = {
    okStones: StoneVO[]
    badStones: StoneVO[]
    prevOkStatusIds: number[]
    prevBadStatusIds: number[]
    nextStatusId: number
}

export default (): [string[], (value: string[]) => any] => {
    const project = useProject()
    const selectedStoneIds = useFrontSelector(uiDuck.selectSelection)

    const dispatch = useDispatch()
    const setSelectedStoneIds = (value:string[]) => {
        if(equals(value, selectedStoneIds))
            return
        dispatch(uiDuck.actions.setSelection(value))
    }
    return [selectedStoneIds, setSelectedStoneIds]

}
