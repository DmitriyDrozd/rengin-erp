import {ProForm, ProFormDatePicker} from "@ant-design/pro-components";
import {Checkbox} from "antd";
import {ExtractProps} from "@sha/react-fp";

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