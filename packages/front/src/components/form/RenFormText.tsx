import {ProForm} from "@ant-design/pro-components";
import {Input} from "antd";
import {ExtractProps} from "@shammasov/utils";
import TextArea from "antd/es/input/TextArea";

type RenFormTextProps = ExtractProps<typeof TextArea> & {multiline?: boolean, label: string, onValueChange: (value: string) => any, disabled?: boolean}

export default ({value,onValueChange, label,multiline,disabled, ...props}:RenFormTextProps) => {
    return (
        <ProForm.Item label={label} {...props} >

                 <Input  value={value}  multiline={multiline} disabled={disabled}  onChange={ e => {
                    console.log("DatePicker onChange",e)


                    onValueChange(e.target.value)
                }
                }/>

        </ProForm.Item>
    );
};