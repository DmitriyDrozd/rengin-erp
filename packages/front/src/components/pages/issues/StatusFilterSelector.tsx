import {Space, Tag} from "antd";
import {
    statusesColorsMap,
    statusesList
} from 'iso/src/store/bootstrap/repos/issues';
import {reject} from "ramda";

export type StatusFilterProps = {
    list: string[],
    statuses: string[],
    setStatuses: (statuses: string[]) => any,
    colorMap: Record<string, string>,
}

export default ({list = statusesList, statuses, setStatuses, colorMap = statusesColorsMap}: StatusFilterProps) => {

    return     <Space size={[0, 8]} wrap>
        {
            list.map( s =>
                statuses.includes(s)
                    ?
                    <Tag key={s} style={{cursor:'pointer', border:'1px'}}  onClick={
                        () => {
                            const newStatuses =reject(st => st === s, statuses)

                            setStatuses(newStatuses)
                        }
                    } color={colorMap[s]}>
                        {s}
                    </Tag>
                : <Tag key={s} style={{cursor:'pointer'}} onClick={
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