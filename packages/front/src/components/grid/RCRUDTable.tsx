import {Card, Col, Row, Table, TableProps} from 'antd'
import Search from 'antd/es/input/Search'
import AddItemButton from '../elements/AddItemButton'
import {BuildNav, nav} from '../nav'
import React, {useState} from 'react'
import {Crud} from '@sha/fsa/src/createCRUDDuck'

type RGripProps<T> = {
    addHref: string
    crud: Crud<T>
    itemNavBase: string,

} & TableProps<T>


export const RCRUDTable=({itemNavBase,crud,...props}:RGripProps) => {

    const [search, setSearch] =  useState()
    const list = search ? props.dataSource.filter() : props.dataSource
    return   ( <Card title={<Row justify={'space-between'}>
            <Col span={4} >Пользователи</Col>
                <Col span={8}><Search></Search></Col>
                <Col span={4} style={{textAlign:'right'}}>
                    <AddItemButton href={itemNavBase+'/new'}  />
                </Col>
                </Row>}>

                <Table {...props} dataSource={list}  />
            </Card>
        )
}

