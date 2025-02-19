import {Space, Tag} from "antd";
import Select from "antd/es/select";
import Tooltip from "antd/es/tooltip";
import {
    statusesColorsMap,
    statusesList
} from 'iso/src/store/bootstrap/repos/issues';

export type StatusFilterProps = {
    list?: string[],
    statuses: string[],
    setStatuses: (statuses: string[]) => any,
    colorMap?: Record<string, string>,
    maxTagCount?: number | 'responsive',
    minWidth?: number
}

const tagRenderer: () => TagRender = (colorMap) => (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    
    return (
      <Tag
        color={colorMap[value]}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginInlineEnd: 4 }}
      >
        {label}
      </Tag>
    );
  };

export default ({list = statusesList, statuses, setStatuses, colorMap = statusesColorsMap, maxTagCount = 1, minWidth = 200}: StatusFilterProps) => {
    const tagRender = tagRenderer(colorMap);
    const options = list.map(item => ({ label: item, value: item }));
    const maxTagPlaceholder = (omittedValues) => (
        <Tooltip
            styles={{ root: { pointerEvents: 'none' } }}
            title={omittedValues.map(({ label }) => label).join(', ')}
        >
        <span>+{omittedValues.length} отображаемых</span>
        </Tooltip>
    );

    return (
        <Space size={[0, 8]} wrap>
            <Select
                mode='multiple'
                style={{ width: '100%', minWidth }}
                options={options}
                placeholder='Отображаемые статусы'
                maxTagCount={maxTagCount}
                value={statuses}
                tagRender={tagRender}
                onChange={setStatuses}
                maxTagPlaceholder={maxTagPlaceholder} 
            />
        </Space>
    )
}