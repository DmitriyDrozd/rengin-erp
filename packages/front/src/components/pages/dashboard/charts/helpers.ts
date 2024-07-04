export const getAnnotation: (
    type: string,
    value: number,
    content?: number | string,
) => any = (type, value, content = value) => ({
    type: 'text',
    position: [type, value],
    content: `${content}`,
    style: {
        textAlign: 'center',
        fontSize: 14,
        fill: 'rgba(0,0,0,0.85)',
    },
    offsetY: -10,
});

const formatter = new Intl.NumberFormat('RU-ru');
export const formatMoneyRub = (amount: number) => formatter.format(amount);