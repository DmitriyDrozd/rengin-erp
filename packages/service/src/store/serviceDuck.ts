import {combineReducers} from 'redux'
import {bootstrapDuck} from 'iso/src/store/bootstrapDuck';


const reducer = combineReducers({
    app: combineReducers({
        bootstrap: bootstrapDuck.reducer,
    })

})
export const serviceDuck = {
    reducer
}


export type SEServiceState = ReturnType<typeof reducer>



