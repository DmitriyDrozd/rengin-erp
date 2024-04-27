import {
    Button,
    Card,
    message,
    Upload,
    UploadFile
} from 'antd';
import {
    DeleteOutlined,
    PlusOutlined,
    ReconciliationOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import React, {
    useEffect,
    useState
} from 'react';
import type {
    RcFile,
    UploadProps
} from 'antd/es/upload';
import { remove } from 'ramda';

export type UploadListProps = {
    items?: UploadFile[]
    onItemsChange: (list: UploadFile[]) => any
    maxCount: number
    sourceId: string
    label: string
    brandName: string
    brandPath: string
}

const XLSX_FILE_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const UploadEstimation = ({onItemsChange, items, maxCount, sourceId, label, brandName, brandPath}: UploadListProps) => {
    const [itemsList, setItemsList] = useState(items);
    const max = maxCount || 1;

    useEffect(() => {
        const isAllLoaded = itemsList.every(f => f.status === 'done' || f.status === undefined);

        if (itemsList.length !== items.length && isAllLoaded) {
            const newItemsList = itemsList.map(i => {
                return i.status ? ({ url: i.response.url, name: i.name }) : ({ url: i.url, name: i.name })
            });

            onItemsChange(newItemsList);
        }
    }, [itemsList]);

    const handleChange: UploadProps['onChange'] = ({fileList: newFileList}) => {
        setItemsList(newFileList);
    };

    const handleRemove: UploadProps['onRemove'] = (name) => {
        const newFileList = items.filter(i => i.name !== name);

        setItemsList(newFileList);
    };

    const isMaxCount = items?.length >= maxCount;

    const uploadButton = (
        <Button icon={<UploadOutlined />} style={{ marginBottom: '8px' }}>Добавить</Button>
    );

    const downloadFile = (originNode, file) => {
        window.open(file.url, '_blank');
    }

    const itemRender = (originNode, file, fileList, actions) => {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px dotted',
                    margin: '8px 0',
                    padding: '8px 8px 8px 0',
                    justifyContent: 'space-between',
                }}
            >
                <Button
                    key={file.name}
                    style={{
                        border: 'none',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                    }}
                    onClick={() => downloadFile(originNode, file, fileList, actions)}
                >
                    <ReconciliationOutlined style={{fontSize: 36, paddingRight: 8}}/>
                    {file.name}
                </Button>
                <Button danger icon={<DeleteOutlined />} onClick={() => handleRemove(file.name)}/>
            </div>
        );
    };

    const beforeUpload = (file) => {
        const isXLSX = file.type === XLSX_FILE_TYPE;

        if (!isXLSX) {
            message.error(`${file.name} - не Excel-файл`);
        }

        return isXLSX || Upload.LIST_IGNORE;
    };

    return (
        <Card title={label} key={label}>
            <Upload
                multiple
                action={'/api/upload/estimation/' + sourceId}
                listType="picture"
                fileList={itemsList}
                onChange={handleChange}
                maxCount={max}
                itemRender={itemRender}
                beforeUpload={beforeUpload}
            >
                {isMaxCount ? null : uploadButton}
            </Upload>
        </Card>
    );
};

export default UploadEstimation;