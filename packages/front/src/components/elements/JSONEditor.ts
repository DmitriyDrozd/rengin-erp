import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css'
import UseWithValue from '@sha/react-fp/src/hooks/useWithValue'
import React from 'react'

type JEProps<T> = {
    value: T
    onValueChanged: (newValue: T) => any
}
const JSONEditor = <T>({value, onValueChanged}: JEProps<T>) => {
    return React.createElement(Editor , {value, onChange: onValueChanged})
}

export default JSONEditor