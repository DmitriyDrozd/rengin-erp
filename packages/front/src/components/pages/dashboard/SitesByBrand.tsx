import {
    BRANDS,
    BrandVO
} from 'iso/src/store/bootstrap/repos/brands';
import {
    LEGALS,
    LegalVO
} from 'iso/src/store/bootstrap/repos/legals';
import {
    SITES,
    SiteVO
} from 'iso/src/store/bootstrap/repos/sites';
import React, {
    useRef,
    useState
} from 'react';
import ReactDOM from 'react-dom';
import { RadialGraph } from '@ant-design/graphs';
import { useSelector } from 'react-redux';

export const SitesByBrand = () => {
    const chartRef = useRef();
    const [opened, setOpened] = useState({});

    const brands: BrandVO[] = useSelector(BRANDS.selectAll);
    const legals: LegalVO[] = useSelector(LEGALS.selectAll);
    const sites: SiteVO[] = useSelector(SITES.selectAll);

    const brandNodes = brands.map(brand => {
        return {
            id: brand.brandId,
            label: brand.brandName,
        }
    });

    const brandEdges = brandNodes.map(node => {
        return {
            source: '0',
            target: node.id,
        }
    });

    const RadialData = {
        nodes: [
            {
                id: '0',
                label: 'Ритейл Инжиниринг',
            },
            ...brandNodes,
        ],
        edges: [
            ...brandEdges,
        ],
    };

    const fetchData = node => {
        return new Promise((resolve, reject) => {
            if (opened[node.id]) {
                setOpened({ ...opened, [node.id]: false });

                resolve({
                    nodes: [],
                    edges: [],
                });
            }

            const isBrand = !!brands.find(b => b.brandId === node.id);
            const isLegal = !!legals.find(b => b.legalId === node.id);
            const isSite = !!sites.find(b => b.siteId === node.id);

            if (isSite) {
                resolve({});
            }

            let newNodes = [];
            let newEdges = [];

            if (isBrand) {
                newNodes = legals.filter(legal => legal.brandId === node.id).map(legal => {
                    return {
                        id: legal.legalId,
                        label: legal.legalName,
                    }
                });

                newEdges = legals.filter(legal => legal.brandId === node.id).map(legal => ({
                    source: node.id,
                    target: legal.legalId,
                }));
            } else if (isLegal) {
                newNodes = sites.filter(site => site.legalId === node.id).map(site => {
                    return {
                        id: site.siteId,
                        label: site.clientsSiteNumber,
                    }
                });

                newEdges = sites.filter(site => site.legalId === node.id).map(site => ({
                    source: node.id,
                    target: site.siteId,
                }));
            }

            setOpened({ ...opened, [node.id]: true });

            resolve({
                nodes: [{...node}, ...newNodes],
                edges: newEdges,
            });
        });
    };

    const asyncData = async (node) => {
        return await fetchData(node);
    };

    const config = {
        data: RadialData,
        autoFit: true,
        layout: {
            unitRadius: 80,
            nodeSize: 20,
            nodeSpacing: 10,
        },
        nodeCfg: {
            asyncData,
            size: 20,
            style: {
                fill: '#6CE8DC',
                stroke: '#6CE8DC',
            },
            labelCfg: {
                style: {
                    fontSize: 5,
                    fill: '#000',
                },
            },
        },
        edgeCfg: {
            style: {
                lineWidth: 1,
            },
            endArrow: {
                d: 10,
                size: 2,
            },
        },
        behaviors: ['drag-canvas', 'zoom-canvas', 'drag-node'],
        onReady: (graph) => {
            chartRef.current = graph;
        },
    };

    return <RadialGraph {...config} />;
};
