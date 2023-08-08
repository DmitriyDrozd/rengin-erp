import AppLayout from '../../app/AppLayout'
import {Button, Card, Modal, Upload} from 'antd'
import Meta from 'antd/es/card/Meta'
import React from 'react'
import Icon from 'antd/es/icon'
import {UploadOutlined} from '@ant-design/icons'
import BRANDS from 'iso/src/store/bootstrap/repos/brands'
import LEGALS from 'iso/src/store/bootstrap/repos/legals'

import {useStore} from 'react-redux'
import * as XLSX from 'xlsx'
import {call, put, select, take} from 'typed-redux-saga'
import {selectLedger} from 'iso/src/store/bootstrapDuck'
import {useClickAway} from 'react-use'
import {generateGuid} from '@sha/random'
import {useFrontStateSelector} from '../../../hooks/common/useFrontSelector'
const xlsxCols = ['brandName','legalName','city','address'] as const
type Datum =Record<typeof xlsxCols[number], string>
const {confirm} = Modal


export default () => {
    const state = useFrontStateSelector()
    const store = useStore()

    return <AppLayout>
        <Card
            hoverable
            style={{ width: '450px' , margin: 'auto' }}

        >
Заявки
        </Card>
    </AppLayout>
}
