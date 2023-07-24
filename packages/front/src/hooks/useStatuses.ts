import useFrontSelector from "./common/useFrontSelector";
import settingsDuck from "iso/src/store/bootstrap/settingsDuck";
import projectsCURD from 'iso/src/store/bootstrap/repos/projectsCURD'


export default (projectId: string = undefined) => {
    const project = useFrontSelector(projectsCURD.selectById(projectId))
    const allStatuses = useFrontSelector(settingsDuck.selectStatuses)


    return {
        allStatuses,
        getStatusById: (id: number) =>
            allStatuses.find(s => s.statusId === id),
    }
}
