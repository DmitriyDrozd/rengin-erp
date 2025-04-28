import {
    Checkbox,
    DatePicker,
    Divider,
    Form,
    Input,
    Select,
    Space,
    Typography
} from 'antd';
import { GENERAL_DATE_FORMAT } from 'iso/src/utils/date-utils';
import CreateButton from '../elements/CreateButton';
import { NumericInput } from '../elements/NumericInput';
import { useContextEditorProperty } from '../pages/chapter-modal/useEditor';
import locale from 'antd/es/date-picker/locale/ru_RU';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import {
    AnyMeta,
    isArrayOfMeta,
    isItemOfMeta
} from 'iso/src/store/bootstrap/core/valueTypes';
import React, {
    useEffect,
    useRef,
    useState
} from 'react';
import {
    getRes,
    RESOURCES_MAP
} from 'iso/src/store/bootstrap/resourcesList';
import { useISOState } from 'iso/src/ISOState';
import './RenField.css';
import getMaxTagPlaceholder from '../elements/MaxTagPlaceholder';

const {Text, Link} = Typography;

export default (props: {
    hidden?: boolean,
    label?: string,
    meta: AnyMeta,
    disabled?: boolean,
    immutable?: boolean,
    customOptions?: {
        value: string,
        label: string
    }[],
    defaultValue?: any,
    customProperties?: any,
    Renderer?: React.FC<any>,
}) => {
    const { hidden, ...restProps } = props;

    return hidden ? null : <RenField {...restProps} />
}

export const RenField = ({label, meta, disabled, customOptions, defaultValue, immutable, customProperties, createButton, Renderer}: {
    label?: string,
    meta: AnyMeta,
    disabled?: boolean,
    immutable?: boolean,
    customOptions?: {
        value: string,
        label: string
    }[],
    defaultValue?: any,
    customProperties?: any,
    createButton?: JSX.Element,
    Renderer?: React.FC,
}) => {
    const [itemToFocus, setItemToFocus] = useState(null);
    const editorProperty = useContextEditorProperty(meta.name);

    const state = useISOState();
    const {
        value,
        updateItemProperty,
        property,
        error,
        mode,
        params,
    } = editorProperty;

    const sharedProps = {
        disabled: (mode === 'edit' ? (property.immutable) : false) || disabled
    };

    const inputRef = useRef(null);

    useEffect(() => {
        if (itemToFocus) {
            itemToFocus?.current?.focus();
            setItemToFocus(null);
        }
    }, [error]);

    const renderInputControl = () => {
        if (Renderer) {
            return (
                <Renderer 
                    value={value} 
                    handleChange={updateItemProperty}
                    disabled={disabled}
                    {...customProperties}
                />
            );
        }

        if ((property.immutable || immutable) && mode === 'edit') {
            let text = value;
            if (isItemOfMeta(property)) {
                const reses = getRes(property.linkedResourceName);
                const linkedItem = reses.selectById(value)(state);

                if (linkedItem)
                    text = reses.getItemName(linkedItem);
            }
            return (
                <Text type="success">{text}</Text>
            );
        }

        const isMeta = isItemOfMeta(property) || isArrayOfMeta(property);

        if (isMeta) {
            const { linkedResourceName } = property;
            const resource = RESOURCES_MAP[linkedResourceName];
            const isMultiple = isArrayOfMeta(property);
            const options = customOptions || params.options;

            return (
                <Select
                    value={value}
                    optionFilterProp={'label'}
                    allowClear
                    showSearch
                    placeholder={label || property.headerName}
                    disabled={disabled}
                    onClear={() => {
                        updateItemProperty(null);
                    }}
                    onChange={e => {
                        updateItemProperty(e);
                    }}
                    style={{minWidth: '200px'}}
                    options={options}
                    dropdownRender={(menu) => (
                        <>
                            {menu}
                            <Divider style={{margin: '8px 0'}}/>
                            <Space style={{padding: '0 8px 4px'}}>
                                {createButton ? createButton : (
                                    <CreateButton type="text" label="Добавить" resource={resource} />
                                )}
                            </Space>
                        </>
                    )}
                    maxTagPlaceholder={isMultiple ? getMaxTagPlaceholder() : null}
                    mode={isMultiple ? 'multiple' : null} 
                    {...sharedProps}
                />);
        }
        if (property.type === 'enum') {
            return (
                <Select
                    allowClear
                    value={value}
                    optionFilterProp={'label'}
                    showSearch={true}
                    placeholder={label || property.headerName}
                    onChange={updateItemProperty}
                    style={{minWidth: '200px'}}
                    options={customOptions || params.options}
                    dropdownRender={(menu) => (
                        <>
                            {menu}

                        </>
                    )}
                    {...sharedProps}
                />);
        } else if (editorProperty.property.type === 'boolean')
            return (
                <Checkbox
                    checked={value}
                    onChange={e => {
                        updateItemProperty(e.target.checked);
                    }}
                    {...sharedProps}/>)
                ;
        else if (editorProperty.property.type === 'date')
            return (
                <DatePicker
                    showTime
                    format={GENERAL_DATE_FORMAT}
                    allowClear
                    locale={locale}
                    defaultValue={defaultValue}
                    value={value === undefined || value === null ? undefined : dayjs(value)}
                    onChange={e => {
                        updateItemProperty(e ? e.toDate().toISOString() : null);
                    }}
                    {...sharedProps}
                    {...customProperties}
                />
            );
        else if (editorProperty.property.type === 'text')
            return (
                <TextArea
                    ref={inputRef}
                    rows={4}
                    value={value}
                    onBlur={e => {
                        updateItemProperty(e.target.value);
                    }}
                    onChange={e => {
                        setItemToFocus(inputRef);
                        updateItemProperty(e.target.value);
                    }}
                    {...sharedProps}
                />
            );
        else if (editorProperty.property.type === 'number') {
            return (
                <NumericInput
                    ref={inputRef}
                    value={editorProperty.value}
                    onChange={updateItemProperty}
                    {...sharedProps}
                />
            )
        } else {
            return (
                <Input
                    ref={inputRef}
                    value={editorProperty.value}
                    onBlur={e => {
                        updateItemProperty(e.target.value);
                    }}
                    onChange={e => {
                        setItemToFocus(inputRef);
                        updateItemProperty(e.target.value);
                    }}
                    {...sharedProps}
                />
            );
        }
    };

    if (error) {
        return (
            <Form.Item label={label || property.headerName} validateStatus={'error'} hasFeedback={true} help={error}
                       required={property.required}>{renderInputControl()}</Form.Item>)
            ;
    }
    return (
        <Form.Item label={label || property.headerName}
                   required={property.required}>{renderInputControl()}</Form.Item>)
        ;
};