import {
    DownloadOutlined,
} from '@ant-design/icons';
import Button from 'antd/es/button';
import Tooltip from 'antd/es/tooltip';
import { onArchiveExport } from './utils';
import { FC } from 'react';
import { fileTypesLabel } from 'iso/src/store/bootstrap/repos/issues';

interface ExportOneTypeButtonProps {
    issueId: string,
    type: string,
}

export const ExportOneTypeButton: FC<ExportOneTypeButtonProps> = ({ issueId, type }) => {
    const handleDownload = () => {
        onArchiveExport({ selectedIds: [issueId], types: [type] });
    };

    const tooltipText = `Скачать все ${fileTypesLabel[type].toLowerCase()}`;

    return (
        <Tooltip placement="topLeft" title={tooltipText} arrow>
            <Button onClick={handleDownload}><DownloadOutlined /></Button>
        </Tooltip>
    )
}