import useCurrentUser from "./useCurrentUser";
import useRole from "./useRole";

/*
export const useCanProperty = (prop: Meta) => {
    const {currentUser } = useCurrentUser()

}

export default useCan*/

export const useCanEstimations = () => {
    const role = useRole()
    debugger
    return role === 'сметчик' || role === 'руководитель'
}