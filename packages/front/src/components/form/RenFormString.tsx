import {ProForm} from "@ant-design/pro-components";
import {Input} from "antd";

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