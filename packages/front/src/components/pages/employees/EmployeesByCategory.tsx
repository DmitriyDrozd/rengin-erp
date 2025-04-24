import { FC } from "react"
import EmployeesListPage from "./EmployeesListPage"
import { employeeCategories, EmployeeVO } from "iso/src/store/bootstrap/repos/employees";
import useCurrentUser from "../../../hooks/useCurrentUser";
import { isUserStaffManager } from "../../../utils/userUtils";

export const EmployeesChapter: FC<never> = () => <EmployeesListPage />;

export const EmployeesProvided: FC<any> = () => {
    const { currentUser } = useCurrentUser();
    const filter = (e: EmployeeVO) => e.isPendingCategory || e.category === employeeCategories.provided;
    const isImportDisabled = !isUserStaffManager(currentUser);

    return (
        <EmployeesListPage
            title="Предварительный поиск"
            href='provided'
            categoryFilter={filter}
            isImportDisabled={isImportDisabled}
        />
    )
}

export const EmployeesChecked: FC<any> = () => {
    const filter = (e: EmployeeVO) => !e.isPendingCategory && e.category === employeeCategories.checked;

    return (
        <EmployeesListPage
            title="Проверенные специалисты"
            href='checked'
            panelProps={{
                isCreateButtonDisabled: true,
            }}
            categoryFilter={filter}
            isImportDisabled
        />
    )
}

export const EmployeesBlacklist: FC<any> = () => {
    const filter = (e: EmployeeVO) => !e.isPendingCategory && e.category === employeeCategories.blacklist;

    return (
        <EmployeesListPage
            title="Черный список"
            href='blacklist'
            panelProps={{
                isCreateButtonDisabled: true,
            }}
            categoryFilter={filter}
            isImportDisabled
        />
    )
}