import axios from 'axios';
import {Action} from 'redux';
import {isArray} from '@sha/utils';

export default async () => {
    const axiosInstance = axios//.create({})
    /*{baseURL: window.location.hostname.includes('localhost')
            ? 'http://localhost:9380'
            :''})*/
    return {
        getNewGToken: async () => {
            const response = await axiosInstance.get('/api/gapis/get-token')

            return response.data.token
        },
        archiveExport: async (payload = {}) => {
            const response = await axiosInstance.post('/api/archive-export', payload)

            return response.data
        },
        emailExport: async (payload: {email: string, images: boolean}) => {
            const response = await axiosInstance.post('/api/email-export', payload)

            return response.data
        },
        login: async (payload: { email, password, remember }) => {
            const response = await axiosInstance.post('/api/user/login', payload)

            return response.data
        },
        fetchBootstrap: async (payload) => {
            const response = await axiosInstance.post('/api/bootstrap', payload)

            return response.data
            /**const response = await axios.post('/api/bootstrap')
             const state = response.data
             return state as any as YPAppState*/
            // return fetchBootstrapMock()
        },
        loadPro: async (id) => {
            const response = await axiosInstance.post('/api/project/'+id, )

            return response.data
            /**const response = await axios.post('/api/bootstrap')
             const state = response.data
             return state as any as YPAppState*/
            // return fetchBootstrapMock()
        },
        pushCommands: async (events: Action[] | Action) => {
            const array = isArray(events) ? events : [events]
            const body = {
                events: array.map(e => ({
                    ...e,
                    sourceUserId: 1,
                    storeGuid: 1,
                }))
            }
            const response = await axiosInstance.post('/api/push-commands', body)
            return response.data
        },
        getBackups: async (): Promise<string[]> => {
            const response = await axiosInstance.get('/api/backup-folders');

            return response.data;
        },
        createBackup: async (): Promise<{ url: string }> => {
            const response = await axiosInstance.post('/api/backup-create');

            return response.data;
        },
        restoreBackup: async (data: { file?: any, folderName?: string }): Promise<any> => {
            const response = await axiosInstance.post('/api/backup-restore', data);

            return response.data;
        }
    }

}
