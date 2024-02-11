import axios from "axios";
import {Action} from "redux";
import {isArray} from "@shammasov/utils";

export const getRestApi = async () => {
    const axiosInstance = axios//.create({})
    /*{baseURL: window.location.hostname.includes('localhost')
            ? 'http://localhost:9380'
            :''})*/
    return {
        getNewGToken: async () => {
            const response = await axiosInstance.get('/api/gapis/get-token')

            return response.data.token
        },
        emailExport: async (payload: { email: string, images: boolean }) => {
            const response = await axiosInstance.post('/api/email-export', payload)

            return response.data
        },
        login: async (payload: { email: string; password: string; remember: boolean }) => {
            const response = await axiosInstance.post('/api/user/login', payload)

            return response.data
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
        }
    }

}