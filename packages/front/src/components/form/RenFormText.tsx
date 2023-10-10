import {ProForm, ProFormDatePicker, ProFormItemProps} from "@ant-design/pro-components";
import {ProFormProps} from "@ant-design/pro-form/es/layouts/ProForm";
import {DatePicker, Form, Input} from "antd";
import {ExtractProps} from "@sha/react-fp";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";

type RenFormDateProps = ExtractProps<typeof ProFormDatePicker>

export default ({value,onValueChange, label, valueEnum,...props}) => {
    return (
        <ProForm.Item label={label} {...props}>
            <TextArea  value={value} onChange={ e => {
                console.log("DatePicker onChange",e)


                onValueChange(e.target.value)
            }
            }/>

        </ProForm.Item>
    );
};