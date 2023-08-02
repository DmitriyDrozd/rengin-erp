import React from 'react'
import {KeyOfValueTypes, ValueTypesType} from 'iso/src/store/bootstrap/core/valueTypes'

const formFieldMapper = <K extends KeyOfValueTypes,>(
    type:K,
    builder: (prop: ReturnType<ValueTypesType[K]>, ) => React.ReactNode): any => ({
  type,
   builder
})
