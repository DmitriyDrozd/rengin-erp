import { createResource } from "../core/createResource";
import { valueTypes } from "../core/valueTypes";

const workTypesRaw = createResource('workType', {
        clientsWorkTypeNumber: valueTypes.string({headerName: 'Номер задачи', required: true, unique: true}),
        title: valueTypes.string({ headerName: 'Название', required: true }),
    },
    {
        nameProp: 'title',
        getItemName: (workType) => {
            return workType?.title || 'не указан'
        },
        langRU: {
            singular: 'Тип работ',
            plural: 'Типы работ',
            some: 'Типов работ'
        }
    }
);

export const workTypeResource = {
    ...workTypesRaw,
    clientsNumberProp: 'clientsWorkTypeNumber',
};

export type WorkTypeVO = typeof workTypesRaw.exampleItem
export const LIST_WORK_TYPES = workTypeResource;

export default LIST_WORK_TYPES;