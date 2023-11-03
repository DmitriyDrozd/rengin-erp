import {useEffect, useState} from "react";

export default <S>(localStorageItemName: string, defaultState: S | undefined =  undefined) => {

    const lsItem = localStorage.getItem(localStorageItemName)
    const localStorageState = lsItem ? JSON.parse(lsItem) : defaultState
    const [state, setStateInternal] = useState(localStorageState);
    const setState = (newState: S) => {

        setStateInternal(newState)
        localStorage.setItem(localStorageState, JSON.stringify(newState))
    }
/*
    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('items'));
        if (items) {
            setItems(items);
        }
    }, []);*/

    return [state, setState]
}