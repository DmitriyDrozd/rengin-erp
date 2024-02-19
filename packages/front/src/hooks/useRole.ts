import useCurrentUser from "./useCurrentUser";

export default () => {
    const currentUser = useCurrentUser()
    return currentUser.role
}
