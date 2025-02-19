import QuestionCircleTwoTone from "@ant-design/icons/lib/icons/QuestionCircleTwoTone";
import Button from "antd/es/button";
import Modal from "antd/es/modal";
import Tooltip from "antd/es/tooltip";
import Typography from "antd/es/typography/Typography";
import { useEffect, useState } from "react";

export const ShortcutHint = () => {
    const [isShortcutTooltipOpen, setIsShortcutTooltipOpen] = useState(true);
    const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);

    const triggerShortcutModal = () => setIsShortcutModalOpen(!isShortcutModalOpen);

    useEffect(() => {
        setTimeout(() => {
            setIsShortcutTooltipOpen(false);
        }, 10000);
    }, []);

    return (
        <>
            <Button onClick={triggerShortcutModal}>
                <Tooltip open={isShortcutTooltipOpen && !isShortcutModalOpen} title="Помощь с таблицей">
                    <QuestionCircleTwoTone />
                </Tooltip>
            </Button>
            <Modal 
                maskClosable
                cancelButtonProps={{ style: { display: 'none' } }} 
                open={isShortcutModalOpen} 
                onOk={triggerShortcutModal} 
                onCancel={triggerShortcutModal} 
                okText='Понятно' 
                closable
            >
                <p>
                    <b>Зажать Ctrl</b> - строка выделяется по клику в любом месте, не в квадрате для галочки. Если нажать на выбранную строку - она пропадет из выбора
                </p>
                <p>
                    <b>Зажать Shift</b> - первый клик определит начальную строку, второй клик выделит все заявки от начальной до нажатой
                </p>
                <p>
                    <b>Ctrl+A</b> выделяет все строки, но галочки не проставляет. Для того, чтобы выбрать все строки, используйте галочку в шапке таблицы    
                </p>
                <p>
                    <b>Пробел</b> - выделить / снять выделение, если не используется мышь
                </p>
            </Modal>
        </>
    )
}