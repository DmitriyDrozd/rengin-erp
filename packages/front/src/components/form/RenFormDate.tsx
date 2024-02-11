import {ProForm} from "@ant-design/pro-components";
import {DatePicker} from "antd";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";
import {ExtractProps} from "@shammasov/react";

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
                          onValueChange(e.toDate().toISOString())
                      }}
          />
        </ProForm.Item>
  );
};