import {useProject} from "./useProject";
import useStatuses from "./useStatuses";
import useRole from "./useRole";
import projectsCURD, {StonePatch, StoneVO} from "iso/src/store/bootstrap/repos/projectsCURD";
import {useDispatch} from "react-redux";
import {arrify} from "@sha/utils";

const noStatStatusId = [1,101,109]
const noSelectStatusIds = [109]
export default (stoneIdsOrId: string[] | string = []) => {
    const project = useProject()
    const getStonesByIds = (ids) =>
        ids.map(id => project.stones[id])

    const stoneIds = getStonesByIds(arrify(stoneIdsOrId))
    const dispatch = useDispatch()

    const isNoStatStatusId = (statusId: number) => {
        return noStatStatusId.includes(statusId)
    }
    const isNoSelectStatusId = (statusId: number) => {
        return noSelectStatusIds.includes(statusId)
    }
    const {projectId} = project


    const getStoneById = id => project.stones[id]
    const stones = getStonesByIds(stoneIds)
    const {currentRole} = useRole()
    const {getStatusById} = useStatuses()

    const isStoneEnabledForCurrentRole = (stoneOrStoneId: StoneVO | string) => {
        const stone: StoneVO = typeof stoneOrStoneId === 'string' ? getStoneById(stoneOrStoneId) : stoneOrStoneId
        const status = getStatusById(stone.statusId)
        return currentRole.sourceStatusesIds.includes(status.statusId)
    }
    return {
        stones,
        allStones: project.stones,
        allProjectElements: project.stones.filter(s => !isNoStatStatusId(s.statusId)),
        getStoneById,
        isStoneEnabledForCurrentRole,
        isNoStatStatusId,
        isNoSelectStatusId,
        updateStatuses: (nextStatusId: number, ids: string[]) => {
            console.log('update statuses to '+nextStatusId, ids)
            const patches: StonePatch[] = ids.map( id =>({
                id,
                statusId: nextStatusId,
            }))

            const action = projectsCURD.actions.stoneStatusesUpdated({
                patches,
                projectId,
            })
            action.meta.persistent = true
            dispatch(action)

        }
    }
}
