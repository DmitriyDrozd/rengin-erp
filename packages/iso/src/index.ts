import {useSelector} from "react-redux";
import {ORMState} from "./store";

export * from "./store";
export * from './appStorage'
export * from  './utils'
export * from './getRestApi'
export * from './appStorage'


export const useORMState = () => useSelector((state: any) => state as ORMState)