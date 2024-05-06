import { createResource } from '../core/createResource';
import { valueTypes } from '../core/valueTypes';

export const taskStatusesList = [
    'Новая',
    'В работе',
    'Выполнена'
] as const;

export type TaskStatus = typeof taskStatusesList[number]

export const taskStatusesColorsMap: Record<TaskStatus, string> = {
    'Новая': 'yellow',
    'В работе': 'blue',
    'Выполнена': 'green',
};

export const paymentStatusesList = [
    'Новая',
    'Согласована',
    'Оплачена'
] as const;

export type PaymentStatus = typeof paymentStatusesList[number]

export const paymentStatusesColorsMap: Record<PaymentStatus, string> = {
    'Новая': 'yellow',
    'Согласована': 'orange',
    'Оплачена': 'green',
};

const tasksRaw = createResource('task', {
        clientsTaskNumber: valueTypes.string({headerName: 'Номер задачи', required: true, unique: true}),

        description: valueTypes.text({headerName: 'Описание', required: true}),

        estimatedTime: valueTypes.number({headerName: 'Оценка времени, ч'}),
        spentTime: valueTypes.number({headerName: 'Затрачено времени, ч'}),

        taskStatus: valueTypes.enum({headerName: 'Статус задачи', internal: true, enum: taskStatusesList}),
        paymentStatus: valueTypes.enum({headerName: 'Статус оплаты', internal: true, enum: paymentStatusesList}),

        removed: valueTypes.boolean({select: false, internal: true}),
    },

    {
        nameProp: 'clientsTaskNumber',
        langRU: {
            singular: 'Задача',
            plural: 'Задачи',
            some: 'Задач'
        }
    }
);

const getTaskTitle = (task: TaskVO) => {
    return `Задача ${task.clientsTaskNumber}`;
};

export const taskResource = {
    ...tasksRaw,
    getTaskTitle,
    clientsNumberProp: 'clientsTaskNumber',
};

export type TaskVO = typeof tasksRaw.exampleItem
export const TASKS = taskResource;

export default TASKS;
