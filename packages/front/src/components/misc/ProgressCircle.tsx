import React, {
    useEffect,
    useState
} from 'react';
import {
    Statistic,
    Typography
} from 'antd';

import './ProgressCircle.css';

const { Countdown } = Statistic;

export const ProgressCircle = ({ progress, label, fullDuration }: { progress: number, label: string, fullDuration?: number }) => {
    const [startTime, setStartTime] = useState(Date.now());

    useEffect(() => {
        setStartTime(Date.now());
    }, [fullDuration]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" style={{ '--value': progress }} />
            <Typography.Title level={5}>{label}</Typography.Title>
            {
                fullDuration !== undefined && (
                    <Countdown title="Осталось ждать:" value={startTime + fullDuration} />
                )
            }
        </div>
    )
}