import AppLayout from '../app/AppLayout'
import {Button, Card, Modal, Spin, Upload} from 'antd'
import Meta from 'antd/es/card/Meta'
import React, {useState} from 'react'
import Icon from 'antd/es/icon'
import {UploadOutlined} from '@ant-design/icons'
import {useFrontStateSelector} from '../../hooks/common/useFrontSelector'
import BRANDS from 'iso/src/store/bootstrap/repos/brands'
import LEGALS from 'iso/src/store/bootstrap/repos/legals'
import SITES from 'iso/src/store/bootstrap/repos/sites'
import {sleep, toAssociativeArray} from '@sha/utils'
import useLedger from '../../hooks/useLedger'
import {useStore} from 'react-redux'
import * as XLSX from 'xlsx'
import {call, put, select, take} from 'typed-redux-saga'
import {selectLedger} from 'iso/src/store/bootstrapDuck'
import {useClickAway} from 'react-use'
import {generateGuid} from '@sha/random'
const xlsxCols = ['brandName','legalName','city','address'] as const
type Datum =Record<typeof xlsxCols[number], string>
const {confirm, info} = Modal
function* importObjectsSaga(data: Datum[]) {
    let created = {
        brands: [],
        legals: [],
        sites: []
    }
    let ledger: ReturnType<typeof selectLedger> = yield* select(selectLedger)

    function* updateLedger() {

        ledger = yield* select(selectLedger)

    }

    function* getOrCreateSite(brandName: string, legalName: string,city: string, address: string) {
        let brand = ledger.brandsByName[brandName]
        if(!brand) {

            const action = BRANDS.actions.added({brandId: generateGuid(), brandName})
            console.log(`Brand ${brandName} not found, create one`, action)
            yield* put(action)
            created.brands.push(action)
            yield* call(updateLedger)
        }
        else  {
            console.log(`Brand ${brandName} found`)
        }
        brand = ledger.brandsByName[brandName]


        let legal = ledger.legalsByName[legalName]
        if(!legal) {
            const action = LEGALS.actions.added({brandId: brand.brandId, legalId: generateGuid(), legalName})
            console.log(`Legal ${legalName} not found, create one`, action)
            yield* put(action)
            created.legals.push(action)
            yield* call(updateLedger)
        }
        legal = ledger.legalsByName[legalName]


        let site = ledger.sites.find(s => s.brandId === brand.brandId && s.legalId === legal.legalId &&
                s.city === city && s.address === address
            )
        if(!site) {

            const action = SITES.actions.added({brandId: brand.brandId, legalId: legal.legalId, city, address, siteId: generateGuid()})
            console.log(`Site not found, create one`, action)
            yield* put(action)
            created.sites.push(action)
            yield* call(updateLedger)
        }
        site = ledger.sites.find(s => s.brandId === brand.brandId && s.legalId === legal.legalId &&
            s.city === city && s.address === address
        )
        return site
    }

    for(let i = 0;i < data.length;i++) {
        const d = data[i]
        yield* call(getOrCreateSite, d.brandName, d.legalName, d.city,d.address)
        yield* call(sleep, 10)
    }

}

export default () => {
    const state = useFrontStateSelector()
    const store = useStore()
    const [loading, setLoading] = useState(false)
    const importFile = async (data: Array<string[]>) => {
        setLoading(true)
       const task =  store.runSaga(importObjectsSaga, data)
        await task
        await sleep(2000)
        const res =  info({
            title:"Записи успешно импортированы",
        })
        setLoading(false)

    }
    return <AppLayout>
        <Spin spinning={loading}>
        <Card
            hoverable
            style={{ width: '450px' , margin: 'auto' }}
            cover={<img alt="example" src="/assets/import-objects-example.png" />}
        >

            <Meta title="Импорт объектов и заказчиков" description={     <p>Подготовьте excel файл с данными как показано в примере <a href={'/assets/import-objects-example.xlsx'} download>образец-адресов.xlsx</a></p>
            } />
            <Upload
                accept=".xls, .xlsx"
                showUploadList={false}
                beforeUpload={file => {
                    const reader = new FileReader();

                    reader.onload = async function(e) {
                        var data = e.target.result;
                        /* reader.readAsArrayBuffer(file) -> data will be an ArrayBuffer */
                        var workbook = XLSX.read(data);
                        const sheet = workbook.Sheets[workbook.SheetNames[0]]
                        const arr = XLSX.utils.sheet_to_json(sheet, {header:xlsxCols})
                           arr.shift()
                        const res =  confirm({
                            title:"Импортировать записи?",
                            content:<div>Найдено <b>{arr.length}</b> объектов с данными об адресах и заказчиках</div>,
                            okText:'Импорт',
                            cancelText:'Отмена',
                            onOk: () => {
                                importFile(arr)
                            }
                        })


                        /* DO SOMETHING WITH workbook HERE */
                    };
                    reader.readAsArrayBuffer(file);

                    // Prevent upload
                    return false;
                }}
            >
                <Button icon={<UploadOutlined />}>
                     Загрузить xls/xlsx файл
                </Button>
            </Upload>;
        </Card>
        </Spin>
    </AppLayout>
}
