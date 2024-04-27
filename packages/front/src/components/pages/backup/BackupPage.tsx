import {
    DownloadOutlined,
    UploadOutlined
} from '@ant-design/icons';
import {
    Button,
    Card,
    Upload,
    Select,
    notification,
    Modal,
} from 'antd';
import Meta from 'antd/es/card/Meta';
import getRestApi from 'iso/src/getRestApi';
import { asDay } from 'iso/src/utils/date-utils';
import React, {
    useCallback,
    useEffect,
    useState
} from 'react';
import AppLayout from '../../app/AppLayout';

const {confirm, info} = Modal

export const BackupPage = () => {
    const [backups, setBackups] = useState([]);
    const [selectedBackup, setSelectedBackup] = useState('');
    const options = backups
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .map(b => ({ value: b, label: b }));

    const loadBackups = async () => {
        const api = await getRestApi();
        setBackups(await api.getBackups());
    };

    useEffect(() => {
        loadBackups();
    }, []);

    const onRestoreClick = useCallback(async () => {
        const api = await getRestApi();
        await api.restoreBackup({ folderName: selectedBackup });

        notification.open({
            message: 'База данных восстановлена',
            description: 'состояние' + selectedBackup,
            type: 'success'
        });
    }, [selectedBackup]);

    const onCreateBackup = async () => {
        const api = await getRestApi();
        const data = await api.createBackup();
        const url = data.url;

        const element = document.createElement('a');
        element.href = url;
        element.download = url;

        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    return (
        <AppLayout
            title="Резервное копирование базы данных"
        >
            <Card>
                <Meta
                    title="Создание резервной копии"
                    description={(
                        <p>
                            Резервная копия будет загружена на Ваш компьютер, а так же будет храниться на сервере.
                        </p>
                    )}
                />
                <Button icon={<DownloadOutlined />} onClick={onCreateBackup}>
                    Создать резервную копию
                </Button>
            </Card>
            <Card>
                <Meta
                    title="Восстановление"
                    description={(
                        <div style={{ marginBottom: 12 }}>
                            <p>
                                Выберите резервную копию по дате создания из списка:
                            </p>
                            <Select
                                style={{ width: 150 }}
                                value={selectedBackup}
                                options={options}
                                onSelect={b => setSelectedBackup(b)}
                                placeholder="Выберите дату резервной копии"
                            />
                            { selectedBackup && (
                                <Button onClick={onRestoreClick}>Восстановить</Button>
                            ) }
                        </div>
                    )}
                />
                {/*<Upload*/}
                {/*    name={'archive.gz'}*/}
                {/*    accept=".gz"*/}
                {/*    showUploadList={true}*/}
                {/*    beforeUpload={file => {*/}
                {/*        const reader = new FileReader();*/}

                {/*        reader.onload = async function(e) {*/}
                {/*            let data = e.target.result;*/}

                {/*            confirm({*/}
                {/*                title:"Восстановить базу данных?",*/}
                {/*                content:<div></div>,*/}
                {/*                okText:'Восстановить',*/}
                {/*                cancelText:'Отмена',*/}
                {/*                onOk: async () => {*/}
                {/*                    const api = await getRestApi();*/}
                {/*                    await api.restoreBackup({ file: data });*/}

                {/*                    info({*/}
                {/*                        title: "База данных восстановлена",*/}
                {/*                        content: ''*/}
                {/*                    });*/}
                {/*                }*/}
                {/*            });*/}
                {/*        };*/}

                {/*        reader.readAsArrayBuffer(file);*/}

                {/*        // Prevent upload*/}
                {/*        return false;*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <Button icon={<UploadOutlined />}>*/}
                {/*        Загрузить .gz файл*/}
                {/*    </Button>*/}
                {/*</Upload>*/}
            </Card>
        </AppLayout>
    );
}