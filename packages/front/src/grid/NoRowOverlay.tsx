import React from 'react';
import {Empty} from 'antd'

export default (props) => {
    return (
        <div
            className="ag-overlay-loading-center"
            style={{ backgroundColor: 'lightcoral', height: '9%' }}
        >
            <Empty description={<span>{props.noRowsMessageFunc()}</span>}>
                Нет данных
            </Empty>

        </div>
    );
};