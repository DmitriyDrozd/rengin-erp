import useRole from "./useRole";

export const useCanManage = () => {
    const role = useRole()
    return role ==='менеджер' || role==='руководитель'
}