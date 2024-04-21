import {ProForm} from "@ant-design/pro-components";
import {DatePicker} from "antd";
import {ExtractProps} from "@sha/react-fp";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";
import { GENERAL_DATE_FORMAT } from 'iso/src/utils/date-utils';

type RenFormDateProps = ExtractProps<typeof DatePicker> & {
    onValueChange:(value: string) => any
    label: string
}

export default ({value,onValueChange, label, disabled, ...props}: RenFormDateProps) => {
    return (
        <ProForm.Item shouldUpdate label={label} {...props}>
          <DatePicker
              format={GENERAL_DATE_FORMAT}
              disabled={disabled}
              locale={locale}
              value={value === undefined? undefined: dayjs(value)}
              onChange={ e => {
                  onValueChange(e ? e.toDate().toISOString() : e)
              }}
          />
        </ProForm.Item>
  );
};