import axios from "axios";
import {Action} from "redux";
import {isArray} from "@shammasov/utils";

export const getRestApi = () => {
    const axiosInstance = axios
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
            const response = await axiosInstance.post('/api/login', payload)

            return response.data
        },
        logout: async () => {
            const response = await axiosInstance.post('/api/logout')

            debugger
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