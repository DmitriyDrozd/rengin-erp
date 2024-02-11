import {USERS} from "iso"
import React from "react"
import {EditorContext, useEditor} from "../chapter-modal/useEditor"
import BaseEditModal from "../BaseItemModal"
import GenericRenAttrs from "../../form/GenericRenAttrs"
import {usersEditor} from "../../../editors/usersEditor"

export default ({id}: {id: string}) => {
    const useEditorData = useEditor(usersEditor,id)
    const {removed, ...propsToRender} = USERS.attributes

    return   <EditorContext.Provider value={useEditorData}>
                <BaseEditModal>
                    <GenericRenAttrs list={Array.from(Object.values(propsToRender))}/>
                </BaseEditModal>
            </EditorContext.Provider>
}