import {ProForm, ProFormDatePicker, ProFormItemProps} from "@ant-design/pro-components";
import {ProFormProps} from "@ant-design/pro-form/es/layouts/ProForm";
import {DatePicker, Form, Input, Select, SelectProps} from "antd";
import {ExtractProps} from "@sha/react-fp";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import locale from "antd/es/date-picker/locale/ru_RU";

import TextArea from "antd/es/input/TextArea";

type RenFormDateProps = ExtractProps<typeof ProFormDatePicker>
//2023-09-21T04:32:05.151Z
const DATE_FORMAT = 'YYYY-MM-DDTHH:MM:SS.sssZ'

export type SelectOption = {
    value: string
    label: string
}
export const optionsFromValuesList = (values: string[]): SelectOption[] => {
    const options: SelectOption[] = []
    values.forEach(v => options.push({value:v, label: v}))
    return options
}
export default ({value,onValueChange, label, options, placeholder, ...props}: {value: string, onValueChange: (value: string) => any, options:SelectOption[],label: string, placeholder?: string}) => {

    return (
        <ProForm.Item label={label} {...props}>
            <Select  value={value}
                     placeholder={placeholder}
                 onChange={ e => {
                    console.log("Select onChange",e)
                    onValueChange(e)
                 }}
                         style={{minWidth:'200px'}}
                 options={options}
            />

        </ProForm.Item>
    );
};