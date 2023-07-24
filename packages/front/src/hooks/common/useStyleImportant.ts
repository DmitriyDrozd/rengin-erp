import React, {useLayoutEffect} from "react";


export default (
    ref: React.MutableRefObject<HTMLElement>,
    styleProperty: string,
    value: string,
    isImportant: boolean = true
) => {
    useLayoutEffect(() => {
        ref.current.style.setProperty(styleProperty, value, isImportant ? 'important' : '');
    }, [/*ref, styleProperty, value, isImportant*/]);

}
