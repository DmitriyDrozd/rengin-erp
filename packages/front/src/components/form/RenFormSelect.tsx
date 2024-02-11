import {ProForm} from "@ant-design/pro-components";
import {Button, Divider, Select, Space} from "antd";

import {PlusOutlined} from "@ant-design/icons";
import {RenSelectOption} from "iso";

//2023-09-21T04:32:05.151Z
const DATE_FORMAT = 'YYYY-MM-DDTHH:MM:SS.sssZ'


export default ({value,onValueChange, label, options, placeholder,disabled, style, showSearch,...props}: {value: string,showSearch?: boolean, onValueChange: (value: string) => any, options:RenSelectOption[],label: string, placeholder?: string, disabled?: boolean, style?: any}) => {
    return (
        <ProForm.Item
            label={label}
            {...props}
        >
            <Select  value={value}

                     optionFilterProp={'label'}
                     showSearch={true}
                     placeholder={placeholder}
                     disabled={disabled}
                     onChange={ e => {
                        console.log("Select onChange",e)
                        onValueChange(e)
                     }}
                     style={{minWidth:'200px',...style}}
                     options={options}
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
            />
        </ProForm.Item>
    );
};