import {ProForm, ProFormDatePicker, ProFormItemProps} from "@ant-design/pro-components";
import {ProFormProps} from "@ant-design/pro-form/es/layouts/ProForm";
import {Checkbox, DatePicker, Form, Input} from "antd";
import {ExtractProps} from "@sha/react-fp";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";

type RenFormDateProps = ExtractProps<typeof ProFormDatePicker>
//2023-09-21T04:32:05.151Z
const DATE_FORMAT = 'YYYY-MM-DDTHH:MM:SS.sssZ'
export default ({value,onValueChange, label, disabled, ...props}) => {
    return (
        <ProForm.Item label={label} {...props}>
            <Checkbox   checked={value}  disabled={disabled} onChange={ e => {
                console.log("DatePicker onChange",e)


                onValueChange(e.target.checked)
            }
            }/>

        </ProForm.Item>
    );
};