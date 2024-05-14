import {
    Button,
    Card,
    Modal,
    Typography,
    Upload
} from 'antd';
import Meta from 'antd/es/card/Meta';
import * as XLSX from 'xlsx';
import {
    CheckOutlined,
    IssuesCloseOutlined,
    StopOutlined,
    UploadOutlined
} from '@ant-design/icons';
import React, { useState } from 'react';

const {confirm, info} = Modal;

export type ImportCardProps<D extends any, K extends keyof D = keyof D> = {
    imgURL: string
    sampleFileURL: string
    title: string
    importedItemsFound: string
    xlsxCols: Readonly<Array<K>>
    onImport: (items: D[], callback?: (args: { newIssues: any[], invalidIssues: any[], duplicatedIssues: any[] }) => void) => Promise<any>
}
export default <D, >(props: ImportCardProps<D>) => {
    const [isLoading, setLoading] = useState(false);
    return <Card
        loading={isLoading}
        hoverable
        style={{width: '450px', margin: 'auto'}}
        cover={<img alt="example" src={props.imgURL}/>}
    >

        <Meta title={props.title}
              description={<p>Подготовьте excel файл с данными как показано в примере <a href={props.sampleFileURL}
                                                                                         download>Образец
                  импорта {props.title}.xlsx</a></p>
              }/>
        <Upload
            accept=".xls, .xlsx"
            showUploadList={false}
            beforeUpload={file => {
                const reader = new FileReader();

                reader.onload = async function (e) {
                    var data = e.target.result;
                    /* reader.readAsArrayBuffer(file) -> data will be an ArrayBuffer */
                    var workbook = XLSX.read(data);
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const arr = XLSX.utils.sheet_to_json(sheet, {header: props.xlsxCols});
                    arr.shift();
                    const res = confirm({
                        title: 'Импортировать записи?',
                        content: <div>Найдено <b>{arr.length}</b> {props.importedItemsFound}</div>,
                        okText: 'Импорт',
                        cancelText: 'Отмена',
                        onOk: async () => {
                            setLoading(true);
                            props.onImport(arr as any, ({
                                                            newIssues,
                                                            invalidIssues,
                                                            duplicatedIssues
                                                        }) => {
                                info({
                                    title: 'Записи успешно импортированы',
                                    content: (
                                        <>
                                            <Card title={<><CheckOutlined style={{ color: '#a0d911'}}/> Импортировано заявок</>}>
                                                <Typography.Text>{newIssues.length}</Typography.Text>
                                            </Card>

                                            {duplicatedIssues.length > 0 && (
                                                <Card title={<><IssuesCloseOutlined style={{ color: '#fa8c16'}} /> Заявки с дублирующимся номером</>}>
                                                    {duplicatedIssues.map(({clientsIssueNumber}, index) => (
                                                        <Typography.Text key={clientsIssueNumber}>
                                                            {clientsIssueNumber || 'номер заявки не указан'}
                                                            {index < duplicatedIssues.length - 1 ? ', ' : ''}
                                                        </Typography.Text>
                                                    ))}
                                                </Card>
                                            )}

                                            {invalidIssues.length > 0 && (
                                                <Card title={<><StopOutlined style={{ color: '#cf1322'}} /> Заявки с неверными данными</>}>
                                                    {invalidIssues.map(({clientsIssueNumber, clientsSiteNumber, error}, index) => (
                                                        <p key={clientsIssueNumber}>
                                                            Номер {clientsIssueNumber || 'не указан'},
                                                            код объекта: {clientsSiteNumber || 'не указан'}.
                                                            Ошибка: {error}
                                                            {index < invalidIssues.length - 1 ? '; ' : ''}
                                                        </p>
                                                    ))}
                                                </Card>
                                            )}
                                        </>
                                    ),
                                });

                                setLoading(false);
                            });
                        }
                    });

                    /* DO SOMETHING WITH workbook HERE */
                };
                reader.readAsArrayBuffer(file);

                // Prevent upload
                return false;
            }}
        >
            <Button icon={<UploadOutlined/>}>
                Загрузить xls/xlsx файл
            </Button>
        </Upload>
    </Card>;
}