import AppLayout from "../../app/AppLayout";

import {useSelector} from "react-redux";
import IssueChart from "./TicketChart";
import {Card, DatePicker} from "antd";
import {Days, Period, TICKETS, TicketVO} from "iso";
import {useState} from "react";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)
const { RangePicker } = DatePicker;
const gridStyle: React.CSSProperties = {
    width: '50%',
    height: '300px',
    textAlign: 'center',
};
export  default () => {
    const [period, setPeriod] = useState([dayjs('2023/11/01'), dayjs('2023/11/03')] as any as Period)
    const start = period[0]
    const end = period[1]
    const issues: TicketVO[] = useSelector(TICKETS.selectors.selectAll)
    const allIssues = issues.filter(Days.isIssueInPeriod(period))
    const activeIssues = allIssues.filter(Days.isIssueActive)

    const closedIssues = allIssues.filter(i => i.status === 'Выполнена')
    const openedIssues = activeIssues.filter(i => dayjs(i.registerDate).isBetween(start, end))
    const outdatedIssues=allIssues.filter(Days.isIssueOutdated)
    const outdatedClosedIssues = outdatedIssues.filter(i => i.status === 'Выполнена' || i.status==='Отменена')
    const outdatedOpenIssues = outdatedIssues.filter(i => i.status ==='В работе')
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
            <Card.Grid style={gridStyle}><b>Новые заявки</b>
                <IssueChart issues={openedIssues} color={'green'}/>

            </Card.Grid>
        <Card.Grid hoverable={false} title={'Закрытые'} style={gridStyle} >
            <b>Закрыто за период</b>
                <IssueChart  issues={closedIssues} color={'orange'}/>
            </Card.Grid>
            <Card.Grid style={gridStyle} title={'Просрочено в закрытых'}  >
                <b>Просрочено в закрытых за период</b>
                <IssueChart  issues={outdatedClosedIssues} color={'blue'}/></Card.Grid>
            <Card.Grid style={gridStyle} title={'Просрочено в работе'}>
                <b>Просрочено в работе в течении пероида</b>
                <IssueChart  issues={outdatedOpenIssues} color={'red'}/></Card.Grid>

        </Card>
    </AppLayout>
}