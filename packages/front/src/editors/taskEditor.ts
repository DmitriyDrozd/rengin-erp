import {
    TASKS
} from 'iso/src/store/bootstrap';
import { buildEditor } from 'iso/src/store/bootstrap/buildEditor';

export const tasksEditor = buildEditor(TASKS, {})
