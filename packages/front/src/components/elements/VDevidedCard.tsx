import {ProCard, ProCardProps} from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import { useState } from 'react';

export default (props: ProCardProps) => {
    const [responsive, setResponsive] = useState(false);
    return (
        <RcResizeObserver
            key="resize-observer"
            onResize={(offset) => {
                setResponsive(offset.width < 596);
            }}
        >
            <ProCard
                split={responsive ? 'horizontal' : 'vertical'}
                bordered
                headerBordered
                {...props}
                >
            </ProCard>
        </RcResizeObserver>
    );
};