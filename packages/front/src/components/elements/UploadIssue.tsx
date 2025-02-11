import {
    Button,
    Card,
    Modal,
    Space,
    Upload,
    UploadFile
} from 'antd';
import {
    LeftCircleOutlined,
    PlusOutlined,
    ReconciliationOutlined,
    RightCircleOutlined
} from '@ant-design/icons';
import { roleEnum } from 'iso/src/store/bootstrap/repos/users';
import React, {
    useEffect,
    useState
} from 'react';
import type {RcFile, UploadProps} from 'antd/es/upload';
import {remove} from "ramda";
import useRole from "../../hooks/useRole";
import useCurrentUser from '../../hooks/useCurrentUser';
import { isUserCustomer } from '../../utils/userUtils';
import { ExportOneTypeButton } from '../pages/issues/export-archive/ExportOneType';

export type UploadListProps = {
    items?: UploadFile[]
    onItemsChange: (list: UploadFile[]) => any
    maxCount: number
    issueId: string
    label:string
    listName:string
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

const downloadFile = (file) => {
    window.open(file.url, '_blank');
}

const UploadIssue = ({onItemsChange, items, maxCount, issueId, label, listName, brandName, brandPath}: UploadListProps) => {
    const role = useRole();
    const { currentUser } = useCurrentUser();
    const isCustomer = isUserCustomer(currentUser);

    const max = maxCount || 1
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [previewIndex, setPreviewIndex] = useState(-1);
    const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);
    const toggleFullScreen = () => {
        setIsFullScreenPreview(!isFullScreenPreview);
    }
    const previewItem = items ? items[previewIndex] : null;

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

        const fileIndex = items?.findIndex(item => item === file);

        setPreviewImage(fileUrl || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || fileUrl!.substring(fileUrl!.lastIndexOf('/') + 1));
        setPreviewIndex(fileIndex);
    };

    // todo: найти способ отключить тамбы через апи компоненты Upload
    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        const itemsWithoutThumbs = newFileList.map(getItemWithoutThumbs);
        onItemsChange(itemsWithoutThumbs);
    }
    const handleRemove: UploadProps['onRemove'] = file => {
        const isFileWithName = (name: string) => (file: UploadFile) => file.name === name
        onItemsChange(remove(items?.findIndex(isFileWithName(file.name)), 1, items))
    }

    const showPrevious = async () => {
        await handlePreview(items[previewIndex - 1]);
    }

    const showNext = async () => {
        await handlePreview(items[previewIndex + 1]);
    }

    const isDisabledUpload = role === roleEnum['инженер'] && !isCustomer;
    const isMaxCount = items?.length >= maxCount;

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Добавить</div>
        </div>
    );

    const modalProps = {
        styles: {
            body: {
                display: 'flex',
                justifyContent: 'center',
            }
        }
    };

    const fullScreenProps = isFullScreenPreview ? {
        width: '100%',
        ...modalProps
    } : modalProps;


    const navPlaceholder =  <div style={{ width: 58 }} />;
    const backButton = previewIndex > 0 ? (
        <Button size={'large'} style={{ border: 'none' }} onClick={showPrevious}>
            <LeftCircleOutlined style={{ fontSize: 28 }}/>
        </Button>
    ) : navPlaceholder

    const nextButton = previewIndex + 1 < items?.length ? (
        <Button size={'large'} style={{ border: 'none' }}>
            <RightCircleOutlined style={{ fontSize: 28 }} onClick={showNext} />
        </Button>
    ) : navPlaceholder

    const isPreviewPdf = previewItem && previewImage?.toLowerCase().includes('.pdf');
    const preview = isPreviewPdf ? (
            <Button
                key={previewItem.name}
                style={{
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                }}
                onClick={() => downloadFile(previewItem)}
            >
                <ReconciliationOutlined style={{fontSize: 36, paddingRight: 8}}/>
                скачать PDF файл
            </Button>
        ) :
        <img onClick={toggleFullScreen} alt="example" style={{ width: '100%', height: 'auto', cursor: isFullScreenPreview ? 'zoom-out' : 'zoom-in' }} src={previewImage} />

    const cardTitle = (
        <Space>
            {label}
            {items?.length > 0 && (
                <ExportOneTypeButton issueId={issueId} type={listName}/>
            )}
        </Space>
    )

    return (
        <Card title={cardTitle} key={label}>
            <Upload
                action={"/api/upload/issue/"+issueId}
                listType="picture-card"
                fileList={items}
                onPreview={handlePreview}
                onRemove={handleRemove}
                onChange={handleChange}
                multiple
                maxCount={max}
                disabled={isDisabledUpload}
            >
                {(isMaxCount || isDisabledUpload) ? null : uploadButton}
            </Upload>
            <Modal centered open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel} {...fullScreenProps}>
                <Space>
                    {backButton}
                    {preview}
                    {nextButton}
                </Space>
            </Modal>
        </Card>
    );
};

export default UploadIssue;