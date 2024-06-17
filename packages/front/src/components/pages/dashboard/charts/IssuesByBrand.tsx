import { Column } from '@ant-design/plots';
import {
    BRANDS,
    BrandVO
} from 'iso/src/store/bootstrap/repos/brands';
import React from 'react';
import { useSelector } from 'react-redux';

export const IssuesByBrand = ({
                                    openedIssues,
                                    closedIssues,
                                    outdatedClosedIssues,
                                    outdatedOpenIssues,
                                }) => {
    const annotations = [];

    const brands: BrandVO[] = useSelector(BRANDS.selectAll);
    const data = brands.map(brand => {
        const brandName = brand.brandName;
        const filterByBrand = (b: BrandVO) => b.brandId === brand.brandId;

        const openedByBrand = openedIssues.filter(filterByBrand).length;
        const closedByBrand = closedIssues.filter(filterByBrand).length;
        const outdatedClosedByBrand = outdatedClosedIssues.filter(filterByBrand).length;
        const outdatedOpenByBrand = outdatedOpenIssues.filter(filterByBrand).length;

        if (!openedByBrand && !closedByBrand && !outdatedClosedByBrand && !outdatedOpenByBrand) {
            return [];
        }

        const getData = (count, type) => ({
            'brand': brandName,
            'value': count,
            'type': type,
        });

        return [
            getData(openedByBrand, 'Активные'),
            getData(closedByBrand, 'Закрытые'),
            getData(outdatedClosedByBrand, 'Просрочено в закрытых'),
            getData(outdatedOpenByBrand, 'Просрочено в работе'),
        ]
    })
        .flat();

    const dataObj = data
        .reduce((acc, item) => {
            if (!acc[item.brand]) {
                acc[item.brand] = [item];
            } else {
                acc[item.brand].push(item);
            }

            return acc;
        }, {});

    brands.map(brand => {
        const brandName = brand.brandName;
        const userData = dataObj[brandName];

        if (userData) {
            const value = userData.reduce((a, d) => a += d.value, 0);
            annotations.push({
                type: 'text',
                position: [brandName, value],
                content: `${value}`,
                style: {
                    textAlign: 'center',
                    fontSize: 14,
                    fill: 'rgba(0,0,0,0.85)',
                },
                offsetY: -10,
            });
        }
    })

    const config = {
        data,
        isStack: true,
        xField: 'brand',
        yField: 'value',
        seriesField: 'type',
        label: {
            position: 'middle',
            layout: [
                {
                    type: 'interval-adjust-position',
                },
                {
                    type: 'interval-hide-overlap',
                },
                {
                    type: 'adjust-color',
                },
            ],
        },
        annotations,
    }

    return <Column {...config} />;
};
