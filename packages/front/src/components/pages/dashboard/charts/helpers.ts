import { uniq } from 'ramda';

export const getAnnotation: (
    type: string,
    value: number,
    options?: { 
        content?: number | string,
        dataCount?: number,
    }
) => any = (type, value, { content = value, dataCount = -1 } = { content: value }) => ({
    type: 'text',
    position: ((xScale, yScales) => { 
        if (dataCount !== -1 && yScales.value.values?.length < dataCount) {
            return [];
        }
        
        return [type, 'max']; 
    }), 
    content: `${content}`,
    style: {
        textAlign: 'center',
        fontSize: 14,
        fill: 'rgba(0,0,0,0.85)',
    },
    offsetY: 0,
});

export const getAnnotationDataCount = (data: { value: any }[]): number => uniq(data.map(({ value }) => value)).length;

const formatter = new Intl.NumberFormat('RU-ru');
export const formatMoneyRub = (amount: number) => formatter.format(amount) + ' ₽';