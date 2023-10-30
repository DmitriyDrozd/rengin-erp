import {ProForm, ProFormDatePicker, ProFormItemProps} from "@ant-design/pro-components";
import {ProFormProps} from "@ant-design/pro-form/es/layouts/ProForm";
import {DatePicker, Form, Input} from "antd";
import {ExtractProps} from "@sha/react-fp";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";
import {e} from "../../../../static/assets/vendor-6932f6a6";

type RenFormDateProps = ExtractProps<typeof DatePicker> & {
    onValueChange:(value: string) => any
    label: string
}

export default ({value,onValueChange, label, disabled, ...props}: RenFormDateProps) => {
    return (
        <ProForm.Item shouldUpdate label={label} {...props}>
          <DatePicker disabled={disabled}
                      locale={locale} value={value === undefined? undefined: dayjs(value)}
                      onChange={ e => {
                          onValueChange(e ? e.toDate().toISOString() : e)
                      }}
          />
        </ProForm.Item>
  );
};