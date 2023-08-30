import UserEditor from '../../elements/UserEditor'
import React from 'react'
import USERS from 'iso/src/store/bootstrap/repos/users'
import {UserOutlined} from '@ant-design/icons'

import {createEditorPage} from '../createEditorPage'


export const UserPage = createEditorPage({crud: USERS,Editor:UserEditor,icon:    <UserOutlined />})