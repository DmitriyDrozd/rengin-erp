import {ProFormDatePicker} from "@ant-design/pro-components";
import {Button, Checkbox, DatePicker, Divider, Form, Input, Select, Space, Typography} from "antd";
import {useContextEditorProperty} from "../pages/chapter-modal/useEditor";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";
import {PlusOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import {AnyAttr, isItemOfAttr} from "@shammasov/mydux";
import {getEntityByEID, useORMState} from "iso";
import {ExtractProps} from "@shammasov/react";

const { Text, Link } = Typography;
type RenFormDateProps = ExtractProps<typeof ProFormDatePicker>
//2023-09-21T04:32:05.151Z
const DATE_FORMAT = 'YYYY-MM-DDTHH:MM:SS.sssZ'

export default ({meta, disabled} :{meta: AnyAttr, disabled?: boolean}) => {
    const editorProperty = useContextEditorProperty(meta.name)

    const state = useORMState()
    const {value,updateItemProperty,property,error, mode,params,editor} = editorProperty

    const sharedProps = {
        disabled:( mode === 'edit' ? (property.immutable ): false)|| disabled    }
    const renderInputControl = () =>{

            if(property.immutable && mode === 'edit') {
                let text = value
                if(isItemOfAttr(property)) {
                   const reses =  getEntityByEID(property.linkedEID as any)
                    const linkedItem = reses.selectors.selectById(value)(state)

                    if(linkedItem)
                        text = reses.getItemName(linkedItem)
                }
                return (

                    <Text type="success">{text}</Text>
                )
            }
            if(isItemOfAttr(property)) {
                return              <Select  value={value}
                                             optionFilterProp={'label'}
                                             showSearch={true}
                                             placeholder={property.headerName}
                                             disabled={disabled}
                                             onChange={ e => {
                                                 console.log("Select onChange",e)
                                                 updateItemProperty(e)
                                             }}
                                             style={{minWidth:'200px'}}
                                             options={params.options}
                                             dropdownRender={(menu) => (
                                                 <>
                                                     {menu}
                                                     <Divider style={{ margin: '8px 0' }} />
                                                     <Space style={{ padding: '0 8px 4px' }}>
                                                         <Button type="text" icon={<PlusOutlined />} >
                                                             Добавить
                                                         </Button>
                                                     </Space>
                                                 </>
                                             )}
                                         {...sharedProps}
                />
            }
            if(property.type === 'enum') {
                return   <Select  value={value}
                                 optionFilterProp={'label'}
                                 showSearch={true}
                                 placeholder={property.headerName}
                                 onChange={ e => {
                                     console.log("Select onChange",e)
                                     updateItemProperty(e)
                                 }}
                                 style={{minWidth:'200px'}}
                                 options={params.options}
                                 dropdownRender={(menu) => (
                                     <>
                                         {menu}

                                     </>
                                 )}
                    {...sharedProps}
                />
            }
            else if (editorProperty.property.type === 'boolean')
                return      <Checkbox   checked={value}
                                        onChange={ e => {
                                                console.log("DatePicker onChange",e)
                                                updateItemProperty(e.target.checked)
                                        }}
                                        {...sharedProps}/>
        else if (editorProperty.property.type === 'date')
            return    <DatePicker
                                  locale={locale}
                                  value={value === undefined? undefined: dayjs(value)}
                                  onChange={ e => {
                                      updateItemProperty(e ? e.toDate().toISOString() : e)
                                  }}
                                  {...sharedProps}
                        />
            else if (editorProperty.property.type === 'text')
                return          <TextArea
                        value={value}

                        onBlur={ e => {
                            updateItemProperty(e.target.value)
                        }}
                        {...sharedProps}
                    />

        else    return (
                <Input
                    value={editorProperty.value}
                    onBlur={e => {
                        updateItemProperty(e.target.value)
                    }}
                    onChange={e => {
                        updateItemProperty(e.target.value)
                    }}
                    {...sharedProps}
                />
            );
    }

    if(error) {
        return <Form.Item label={property.headerName}  validateStatus={'error'} hasFeedback={true} help={error} required={property.required}  >{renderInputControl()}</Form.Item>
    }
    return <Form.Item label={property.headerName}  required={property.required}  >{renderInputControl()}<span></span></Form.Item>
};