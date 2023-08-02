import {Button, Space} from 'antd'

export type EditorFooterProps = {
    cancelText?: string
    saveText?: string
    onSave?: Function
    onCancel: Function
}
export default ({onSave, onCancel, cancelText, saveText}: EditorFooterProps) => {
    return     <div style={{ textAlign: 'right' }}>
        <Space size="small">
            <Button
                danger={true}
                type={'default'}
                htmlType={'button'}
                onClick={() =>{

                    onCancel()}}
            >
                {cancelText|| 'Отмена'}
            </Button>
            <Button
            htmlType={'reset'}  type={'dashed'}

        >
            {cancelText|| 'Сбросить'}
        </Button>
            <Button    onClick={() => {
                if(onSave)
                onSave()
            }} type="primary" htmlType="submit">
                {saveText||'Сохранить'}
            </Button>
        </Space>
    </div>
}