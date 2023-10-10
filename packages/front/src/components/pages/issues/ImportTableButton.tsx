import ImportDialog, {ImportCardProps} from "../../elements/ImportCard";
import {Button, Modal} from "antd";
import {useCallback, useState} from "react";
import useIssue from "../../../contexts/useIssue";
import {useToggle} from "react-use";
import ImportCard from "../../elements/ImportCard";

export type ImportTableButton<T> = ImportCardProps<T>
export default <T,>(props: ImportTableButton<T>) => {
    const [isOpen, toggleOpen] = useToggle(false)
    return <>
        <Button onClick={toggleOpen} type={"dashed"} danger={true}>Импорт</Button>
        <Modal title="Импорт"
               open={isOpen}
               onOk={toggleOpen}
               onCancel={toggleOpen}>
        <ImportCard<T>
            {...props}
        >
        </ImportCard>
        </Modal>
    </>
}