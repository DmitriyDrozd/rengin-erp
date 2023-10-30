import AppLayout from "../../app/AppLayout";
import {ISSUES} from "iso/src/store/bootstrap";
import {useSelector} from "react-redux";
import IssueChart from "./IssueChart";
import {Card} from "antd";
import { DatePicker, Space } from 'antd';
import {IssueVO} from "iso/src/store/bootstrap/repos/issues";
import {useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'
import {Period} from "./dates";
dayjs.extend(isBetween)
const { RangePicker } = DatePicker;
const gridStyle: React.CSSProperties = {
    width: '50%',
    height: '300px',
    textAlign: 'center',
};
export  default () => {
    const [period, setPeriod] = useState([] as any as Period)
    const start = period[0]
    const end = period[1]
    const issues: IssueVO[] = useSelector(ISSUES.selectAll)

    const openedIssues = issues.filter(i => dayjs(i.registerDate).isBetween(start, end))
    const closedIssues = issues;
    const outdatedClosedIssues = issues;
    const outdatedOpenIssues = issues
    return  <AppLayout
        hidePageContainer={true}
        proLayout={{contentStyle:{
                padding: '0px'
            }
        }}
    >
        <Card title="Графики">
            <Card.Grid style={{width:'100%', height:'80px'}}>Период: <RangePicker
                value={period}
                onChange={
                    (dates: Period) => {
                        console.log('onChange', dates)
                        setPeriod(dates)
                    }
                }

            /></Card.Grid>
            <Card.Grid style={gridStyle} title={'Все заявки'}> <IssueChart issues={openedIssues} color={'green'}/></Card.Grid>
            <Card.Grid hoverable={false} title={'Закрытые'} style={gridStyle} >
                <IssueChart  issues={closedIssues} color={'orange'}/>
            </Card.Grid>
            <Card.Grid style={gridStyle} title={'Просрочено в закрытых'} >
                <IssueChart  issues={outdatedClosedIssues} color={'blue'}/></Card.Grid>
            <Card.Grid style={gridStyle} title={'Просрочено в работе'}> <IssueChart  issues={outdatedOpenIssues} color={'red'}/></Card.Grid>

        </Card>
    </AppLayout>
}