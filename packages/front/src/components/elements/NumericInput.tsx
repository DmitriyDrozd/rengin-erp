import React from 'react';
import { Input } from 'antd';

interface NumericInputProps {
    disabled?: boolean;
    value: string;
    onChange: (value: string) => void;
}

const allowedKeys = ['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
const checkNumber = (value: string) => !isNaN(Number.parseFloat(value));

export const NumericInput = (props: NumericInputProps) => {
    const { value, onChange } = props;

    const filterNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { key, ctrlKey } = e;

        if (ctrlKey || allowedKeys.includes(key)) {
            return;
        }

        const isANumber = checkNumber(key);
        const isDot = key === '.';
        const isAnotherDot = isDot && value?.indexOf('.') > 0;

        if (key === '.' && !isAnotherDot) {
            return;
        }

        if (!isANumber || isAnotherDot) {
            e.preventDefault();
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: inputValue } = e.target;
        onChange(inputValue);
    };

    // '.' at the end or only '-' in the input box.
    const handleBlur = () => {
        let valueTemp = value;

        if (valueTemp === undefined) {
            onChange(valueTemp);
            return;
        }

        if (value.charAt(value.length - 1) === '.' || value === '-') {
            valueTemp = value.slice(0, -1);
        }

        onChange(valueTemp.replace(/0*(\d+)/, '$1'));
    };

    return (
        <Input
            {...props}
            onKeyDown={filterNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={16}
        />
    );
};
