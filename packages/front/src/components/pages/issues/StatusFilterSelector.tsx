import {Space, Tag} from "antd";
import {Status, statusesColorsMap, statusesList} from "iso/src/store/bootstrap/repos/issues";
import {reject} from "ramda";
import {CloseCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";
export type StatusFilterProps = {
    statuses: Status[],
    setStatuses: (statuses: Status[]) => any
}

export default ({statuses,setStatuses}: StatusFilterProps) => {

    return     <Space size={[0, 8]} wrap>
        {
            statusesList.map( s =>
                statuses.includes(s)
                    ?
                    <Tag  style={{cursor:'pointer', border:'1px'}}  onClick={
                        () => {
                            const newStatuses =reject(st => st === s, statuses)

                            setStatuses(newStatuses)
                        }
                    } color={statusesColorsMap[s]}>
                        {s}
                    </Tag>
                : <Tag style={{cursor:'pointer'}} onClick={
                        () => {

                            setStatuses([...statuses, s])
                        }
                    } >
                        {s}
                    </Tag>
            )
        }

    </Space>
}