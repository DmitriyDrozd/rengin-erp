import {
    Card,
    Modal,
    Upload,
    UploadFile
} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import { roleEnum } from 'iso/src/store/bootstrap/repos/users';
import React, {
    useEffect,
    useState
} from 'react';
import type {RcFile, UploadProps} from 'antd/es/upload';
import {remove} from "ramda";
import useRole from "../../hooks/useRole";

export type UploadListProps = {
    items: UploadFile[]
    onItemsChange: (list: UploadFile[]) => any
    maxCount: number
    issueId: string
    label:string
    brandName: string
    brandPath: string
}


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

const UploadSection = ({onItemsChange,items,maxCount,issueId,label,brandName,brandPath}:UploadListProps) => {
    const role = useRole()
    const max = maxCount || 1
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    // Хак для обновления пути к файлам с неправильным сохраненным путем (до исправления 08.04.2024)
    useEffect(() => {
        if (!items || !brandName || !brandPath) {
            return;
        }

        let changed = 0;

        const processedItems = items.map(item => {
            const newItem = { ...item };
            const [none, pUploads, pIssues, pBrand, fileName] = item.response?.url?.split('/') || [];

            if (pBrand !== brandName && fileName) {
                changed++;
                newItem.response.url = `/${pUploads}/${pIssues}/${brandPath}/${fileName}`;

                if (item.url) {
                    newItem.url = newItem.response.url;
                }
            }

            return newItem;
        });

        if (changed > 0) {
            onItemsChange(processedItems.map(getItemWithoutThumbs));
        } else if (items.some(item => item.thumbUrl?.length > 500)) {
            onItemsChange(items.map(getItemWithoutThumbs));
        }
        console.log(label);
    }, []);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        const fileUrl = file.url ||  file.response?.url;

        if (!fileUrl && !file.preview) {
            let preview;

            try {
                preview = await getBase64(file.originFileObj as RcFile);
            } catch (e) {
                preview = file.thumbUrl;
            }

            file.preview = preview;
        }

        setPreviewImage(fileUrl || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || fileUrl!.substring(fileUrl!.lastIndexOf('/') + 1));
    };

    // todo: найти способ отключить тамбы через апи компоненты Upload
    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        const itemsWithoutThumbs = newFileList.map(getItemWithoutThumbs);
        onItemsChange(itemsWithoutThumbs);
    }
    const handleRemove: UploadProps['onRemove'] = file => {
        console.log('handleRemove', file)
        const isFileWithName = (name: string) => (file: UploadFile) => file.name === name
        onItemsChange(remove(items.findIndex(isFileWithName(file.name)), 1, items))
    }

    const isDisabledUpload = role === roleEnum['сметчик'] || role === roleEnum['инженер'];
    const isMaxCount = items?.length >= maxCount;

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Добавить</div>
        </div>
    );

    return (
        <Card title={label} key={label}>
            <Upload
                action={"/api/upload/"+issueId}
                listType="picture-card"
                fileList={items}
                onPreview={handlePreview}
                onRemove={handleRemove}
                onChange={handleChange}
                multiple={true}
                maxCount={max}
                disabled={isDisabledUpload}
            >
                {(isMaxCount || isDisabledUpload) ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </Card>
    );
};

export default UploadSection;