import {
    Card,
    message,
    Upload,
    UploadFile
} from 'antd';
import {
    PlusOutlined,
} from '@ant-design/icons';
import React from 'react';
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

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const getItemWithoutThumbs = (item: any) => item.status === 'done' ? {
    ...item,
    thumbUrl: item.response?.url || item.url,
} : item;

const UploadSection = ({onItemsChange, items, maxCount, sourceId, label, brandName, brandPath}: UploadListProps) => {
    const max = maxCount || 1;

    const handlePreview = async (file: UploadFile) => {
        alert('открытие файла в новой вкладке');
    };

    // todo: найти способ отключить тамбы через апи компоненты Upload
    const handleChange: UploadProps['onChange'] = ({fileList: newFileList}) => {
        const itemsWithoutThumbs = newFileList.map(getItemWithoutThumbs);

        onItemsChange(itemsWithoutThumbs);
    };

    const handleRemove: UploadProps['onRemove'] = file => {
        const isFileWithName = (name: string) => (file: UploadFile) => file.name === name;

        onItemsChange(remove(items?.findIndex(isFileWithName(file.name)), 1, items));
    };

    const isMaxCount = items?.length >= maxCount;

    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Добавить</div>
        </div>
    );

    return (
        <Card title={label} key={label}>
            <Upload
                multiple
                action={'/api/upload-xslx/' + sourceId}
                listType="picture"
                fileList={items}
                onPreview={handlePreview}
                onRemove={handleRemove}
                onChange={handleChange}
                maxCount={max}
                iconRender={() => <>ICON</>}
                itemRender={() => <>ITEM</>}
                beforeUpload={(file) => {
                    const isXLSX = file.type === XLSX_FILE_TYPE;
                    if (!isXLSX) {
                        message.error(`${file.name} - не Excel-файл`);
                    }

                    return isXLSX || Upload.LIST_IGNORE;
                }}
                showUploadList={{
                    showDownloadIcon: true,
                    // downloadIcon: 'Download',
                    showRemoveIcon: true,
                    // removeIcon: <StarOutlined onClick={(e) => console.log(e, 'custom removeIcon event')} />,
                }}
            >
                {isMaxCount ? null : uploadButton}
            </Upload>
        </Card>
    );
};

export default UploadSection;