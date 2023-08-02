import LogRocket from 'logrocket'
import {FrontState} from '../store/frontReducer'

const sanitizeProject = (project: Partial<ProjectVO>) => {
    const {events,stones,...proj} = project
    /*if (report?.current?.tableData?.rows?.length > 100) {
        return R.over(R.lensPath(['current', 'tableData', 'rows']), R.take(100))(report)
    }*/
    return
}

export default LogRocket.reduxMiddleware({
    actionSanitizer(action: any): any | null {
        if(action.type.includes('reset'))
            return null
        /* if (biReportsDuck.actions.patched.isType(action)) {

             return R.over(R.lensPath(['payload']), sanitizeRowsInReports)(action)
         }*/
        return action
    },
    stateSanitizer(state: FrontState): FrontState {
      /* const sanitizedState = R.over(R.lensPath<FrontState,ProjectVO[]>(['app','bootstrap','projects']),
                projects => projects.map(
                    ({events,stones,...proj}: ProjectVO) => {
                        const sanitizedProject: ProjectVO = {...proj, events: R.takeLast(10, events) as any as ProjectVO['events'], stones: R.take(10, stones)as any as ProjectVO['stones']}
                        return sanitizedProject
                    }
                )
        )
        return sanitizedState*/
        return state
    }
})
