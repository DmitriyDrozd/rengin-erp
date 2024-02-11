import {Middleware} from "@reduxjs/toolkit"
import {Dispatch, MiddlewareAPI} from "redux";
import {Connection} from "mongoose";
import EventStore from "./EventStore";
import {isPersistentAction} from "@shammasov/mydux";

export const  createEventStoreMiddleware = (mongo: Connection) :Middleware  =>
    (api: MiddlewareAPI<Dispatch>) => {
        const eventStore = EventStore(mongo)
        const appliedGuids: string[] = []
        return (next: (action: unknown) => unknown) => {
            return (action: unknown) => {
                console.log('Call eventStore middleware')
                if(isPersistentAction(action)) {

                    if (action && action.meta && action.meta.persistent && !action.meta.replay) {

                        if(!action.type.endsWith('reset') && !action.type.startsWith('sessions') && !action.meta.replay) {

                            if (!appliedGuids.includes(action.guid)) {
                                console.log('SAVE EVENT TO STORE', action)
                                eventStore.create(action)
                                appliedGuids.push(action.guid)
                            }
                        }
                    }
                }
                next(action)


            }
        }
    }