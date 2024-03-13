import { message } from 'antd';
import copy from 'copy-to-clipboard';
import React from 'react';

export const CellRendererWithCopy = (props: {
    rowIndex: number;
    value: string;
}) => {
    return (
        <a onClick={() => {
            copy(props.value);
            message.info('Cкопировано "' + props.value + '"');
        }}>
            {props.value}
        </a>
    );
};
