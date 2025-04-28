import Tooltip from "antd/es/tooltip";


const getMaxTagPlaceholder = ({ label = '' }: { label?: string } = {}) => (omittedValues) => (
    <Tooltip
        styles={{ root: { pointerEvents: 'none' } }}
        title={omittedValues.map(({ label }) => label).join(', ')}
    >
    <span>+{omittedValues.length}{label ? ` ${label}` : ''}</span>
    </Tooltip>
);

export default getMaxTagPlaceholder;