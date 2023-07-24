import useStatuses from './useStatuses'
import {useProject} from './useProject'
import {all} from 'typed-redux-saga'

export default (projectId: string) => {
    const project = useProject(projectId)
    const {allStatuses,getStatusById} = useStatuses()


    const projectStatuses = projectId ? allStatuses.filter(s => s.statusType === project.projectStatusesType):[]

    console.log('projectStatuses', projectStatuses.map(p => p.statusId).join(','))
    return {
        projectStatuses,
        getStatusById,
    }
}