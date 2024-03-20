import React, { useState } from 'react';
import {
    Checkbox,
    Modal
} from 'antd';

interface ExportArchiveSelectorProps {
    isOpen: boolean,
    selectedIds: string[],
    onClose: () => void,
    onExport: (options: { selectedIds: string[], types: string[] }) => void,
}

const fileTypes = {
    act: 'actFiles',
    work: 'workFiles',
    check: 'checkFiles'
};

const options = [
    { label: 'Акты', value: fileTypes.act },
    { label: 'Работы', value: fileTypes.work },
    { label: 'Чеки', value: fileTypes.check },
];

export const ExportArchiveSelector: React.FC<ExportArchiveSelectorProps> = ({ isOpen, selectedIds, onClose, onExport }) => {
    const [types, setTypes] = useState([
        fileTypes.act, fileTypes.work, fileTypes.check
    ]);

    const handleOk = () => {
        onExport({
            selectedIds,
            types,
        })
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    const onChange = (checkedValues: string[]) => {
        setTypes(checkedValues);
    };

    return (
        <Modal title="Выгрузка архива" open={isOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Выбрано заявок: {selectedIds.length}</p>
            <div>
                <p>Выберите типы экспортируемых изображений:</p>
                <Checkbox.Group
                    options={options}
                    defaultValue={types}
                    onChange={onChange}
                />
            </div>
        </Modal>
    );
};
