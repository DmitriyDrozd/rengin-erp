import {ProForm, ProFormDatePicker} from "@ant-design/pro-components";
import {Input} from "antd";
import {ExtractProps} from "@shammasov/utils";

type RenFormDateProps = ExtractProps<typeof ProFormDatePicker>
//2023-09-21T04:32:05.151Z
const DATE_FORMAT = 'YYYY-MM-DDTHH:MM:SS.sssZ'
export default ({value,onValueChange, label, ...props}) => {
    return (
        <ProForm.Item label={label} {...props}>
            <Input  value={value} onChange={ e => {
                console.log("DatePicker onChange",e)
                onValueChange(e.target.value)
            }
            }/>

        </ProForm.Item>
    );
};