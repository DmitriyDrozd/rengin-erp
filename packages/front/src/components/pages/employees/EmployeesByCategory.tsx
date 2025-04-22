import { FC } from "react"
import EmployeesListPage from "./EmployeesListPage"
import { employeeCategories, EmployeeVO } from "iso/src/store/bootstrap/repos/employees";

export const EmployeesChapter: FC<never> = () => <EmployeesListPage />;

export const EmployeesProvided: FC<any> = () => {
    const filter = (e: EmployeeVO) => e.isPendingCategory || e.category === employeeCategories.provided;

    return (
        <EmployeesListPage
            title="Предварительный поиск"
            href='provided'
            categoryFilter={filter}
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