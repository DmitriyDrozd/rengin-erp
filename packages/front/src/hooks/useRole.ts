import useFrontSelector from "./common/useFrontSelector";
import {uiDuck} from "../store/ducks/uiDuck";
import {useProject} from "./useProject";
import useStatuses from "./useStatuses";
import settingsDuck from "iso/src/store/bootstrap/settingsDuck";
import {prop} from "ramda";
import {WSElementID} from "scene/src/utils";

export default () => {
    const roleId = useFrontSelector(uiDuck.selectRole)
    const roles = useFrontSelector(settingsDuck.selectSettings).roles
    const role = roles.find(r => r.role === roleId)
    const project = useProject()
    const {getStatusById, allStatuses} = useStatuses()
    const isAdmin = roleId === 1
    const allowedStatusesByStoneId = (stoneId: string) => {
        if (isAdmin) {
            return allStatuses
        }
        const stone = project.stones.find(s => s.id === stoneId)
        if (!stone)
            return []
        const currentStatus = getStatusById(stone.statusId)
        allStatuses.filter(s => currentStatus.nextStatusesIds.includes(s.statusId))
        return allStatuses
    }
    var  currentRoleDestinationStatusIds= () =>
        isAdmin
            ? allStatuses.map(prop('statusId'))
            : role.destinationStatusesIds
    var  currentRoleDestinationByPrevStatusId= (statusId) => {

        return currentRoleDestinationStatusIds().filter(d => d ===statusId)
    }

    return {
        isAdmin,
        allowedStatusesByStoneId,
        currentRole: role,
        currentRoleDestinationStatusIds,
        currentRoleDestinationByPrevStatusId,

    }
}
