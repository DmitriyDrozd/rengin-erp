import React, { useState } from 'react';
import {
    Checkbox,
    Modal
} from 'antd';
import { fileTypes, fileTypesLabel } from 'iso/src/store/bootstrap/repos/issues';

interface ExportArchiveSelectorProps {
    isOpen: boolean,
    selectedIds: string[],
    onClose: () => void,
    onExport: (options: { selectedIds: string[], types: string[] }) => void,
}

const options = [
    { label: fileTypesLabel[fileTypes.act], value: fileTypes.act },
    { label: fileTypesLabel[fileTypes.work], value: fileTypes.work },
    { label: fileTypesLabel[fileTypes.check], value: fileTypes.check },
    { label: fileTypesLabel[fileTypes.estimations], value: fileTypes.estimations },
];

export const ExportArchiveSelector: React.FC<ExportArchiveSelectorProps> = ({ isOpen, selectedIds, onClose, onExport }) => {
    const [types, setTypes] = useState([
        fileTypes.act, fileTypes.work, fileTypes.check, fileTypes.estimations
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
