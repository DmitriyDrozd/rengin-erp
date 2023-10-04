import {ProForm, ProFormDatePicker, ProFormItemProps} from "@ant-design/pro-components";
import {ProFormProps} from "@ant-design/pro-form/es/layouts/ProForm";
import {DatePicker, Form, Input} from "antd";
import {ExtractProps} from "@sha/react-fp";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";

type RenFormDateProps = ExtractProps<typeof ProFormDatePicker>
//2023-09-21T04:32:05.151Z
const DATE_FORMAT = 'YYYY-MM-DDTHH:MM:SS.sssZ'
export default ({value,onValueChange, label, ...props}) => {


    return (
        <ProForm.Item shouldUpdate label={label} {...props}>
          <DatePicker locale={locale} value={value === undefined? undefined: dayjs(value)} onChange={ e => {
              console.log("DatePicker onChange",e)


              onValueChange(e ? e.toDate().toISOString() : e)
          }
          }/>

         </ProForm.Item>
  );
};