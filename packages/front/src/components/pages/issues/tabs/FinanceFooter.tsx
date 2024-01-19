import {ISSUES} from "iso/src/store/bootstrap";
import {IssueVO} from "iso/src/store/bootstrap/repos/issues";
import {Descriptions} from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";
import React from "react";

export default ({issue}: {issue: IssueVO}) => {
    const items=[{
        label:ISSUES.properties.estimationPrice.headerName,
        children: issue.estimationPrice
    },{
        label:'Прибыль',
        children: issue.estimationPrice - issue.expensePrice

    }, {
        label:ISSUES.properties.expensePrice.headerName,
        children: issue.expensePrice
    }, {
        label:'Маржинальность',
        children: ( issue.estimationPrice && issue.expensePrice)
            ? (((issue.estimationPrice - issue.expensePrice) / issue.estimationPrice * 100).toFixed(2) + '%')
            : "-"
    }]

    return       <Descriptions
        column={2}
        title="Показатели"
        size={'small'}
        bordered={true}

    >{items.map( ({label, children}, index) =>
        <DescriptionsItem label={label} key={index}>{children}</DescriptionsItem>)}</Descriptions>

}