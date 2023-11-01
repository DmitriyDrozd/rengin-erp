import {Card, Modal, Upload, UploadFile} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import React, {useState} from 'react';
import type {RcFile, UploadProps} from 'antd/es/upload';
import {remove} from "ramda";
import useRole from "../../hooks/useRole";
import {useCanEstimations} from "../../hooks/useCan";

export type UploadListProps = {
    items: UploadFile[]
    onItemsChange: (list: string[]) => any
    maxCount: number
    issueId: string
    label:string
}


const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const UploadSection = ({onItemsChange,items,maxCount,issueId,label}:UploadListProps) => {
    const role = useRole()
    const max = maxCount || 1
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        onItemsChange(newFileList)
    const handleRemove: UploadProps['onRemove'] = file => {
        console.log('handleRemove', file)
        onItemsChange(remove(items.indexOf(f => f.name === file.name), 1, items))
    }
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <Card title={label}>
            <Upload
                action={"/api/upload/"+issueId}
                listType="picture-card"
                fileList={items}
                onPreview={handlePreview}
                onRemove={handleRemove}
                onChange={handleChange}
                multiple={true}
                maxCount={max}
                disabled={role === 'сметчик'}
            >
                {items.length >= maxCount ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </Card>
    );
};

export default UploadSection;