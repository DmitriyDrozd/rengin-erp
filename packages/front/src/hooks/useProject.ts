import {useSelector} from "react-redux";
import projectsCURD, {ProjectVO} from "iso/src/store/bootstrap/repos/projectsCURD";
import {useLocation, useParams} from "react-router";
import useRouteProps from "./useRouteProps";


export const useProject = (projectId = undefined as string): ProjectVO => {
    const props = useRouteProps()
    const location = useLocation()
    const params = useParams<{ projectId: string }>()

    const idToSelect = projectId || params.projectId || location.pathname.split('/').pop()
    const project = useSelector((projectsCURD.selectById(idToSelect)))

    return project
}
