import * as Icons from '@ant-design/icons';
import {AppstoreOutlined, BarChartOutlined, CalendarOutlined, ImportOutlined, MailOutlined} from '@ant-design/icons';
import React from 'react'
import {AntdIcons} from '../../components/elements/AntdIcons'
import {RoleType} from "iso"

export default (role: RoleType) =>{
    const routesInit = role === 'руководитель'?
        [{
            path: "/in/dashboard",
            name: "Дашборд",
            icon: <BarChartOutlined />,
        }] : []
    return {
        route: {

            routes: [
                ...routesInit,
                {
                    path: "/in/issues",
                    name: "Заявки",
                    icon: <MailOutlined />,
                },
                {
                    path: "/app/in/contracts",
                    name: "Договоры",
                    icon: <CalendarOutlined />,
                },
                {
                    path: "/app/in/subs",
                    name: "Подписки",
                    icon: <AntdIcons.AccountBookOutlined />,
                },
                {
                    path: "/app/in/dicts",
                    name: "Справочники",
                    icon: <AppstoreOutlined />,
                    routes: [
                        {
                            path: "/app/in/brands",
                            name: "Заказчики",
                            icon: <AppstoreOutlined />,
                        },
                        {
                            path: "/app/in/legals",
                            name: "Юр Лица",
                            icon: <AppstoreOutlined />,
                        },
                        {
                            path: "/app/in/sites",
                            name: "Объекты",
                            icon: <AppstoreOutlined />,
                        },
                        {

                            path: "/app/in/import-sites",
                            name: "Импорт",
                            icon: <ImportOutlined />,
                        }
                    ]
                },
                {
                    path: "/app/in/users",
                    name: "Контакты",
                    icon: <Icons.UserOutlined/>
                },

            ]

        },

        appList: [] as any[]/* [
            {
                icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
                title: 'В этом месяце',
                desc: '杭州市较知名的 UI 设计语言',
                url: 'https://ant.design',
            },
            {
                icon: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
                title: 'AntV',
                desc: '蚂蚁集团全新一代数据可视化解决方案',
                url: 'https://antv.vision/',
                target: '_blank',
            },
            {
                icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
                title: 'Pro Components',
                desc: '专业级 UI 组件库',
                url: 'https://procomponents.ant.design/',
            },
            {
                icon: 'https://img.alicdn.com/tfs/TB1zomHwxv1gK0jSZFFXXb0sXXa-200-200.png',
                title: 'umi',
                desc: '插件化的企业级前端应用框架。',
                url: 'https://umijs.org/zh-CN/docs',
            },

            {
                icon: 'https://gw.alipayobjects.com/zos/bmw-prod/8a74c1d3-16f3-4719-be63-15e467a68a24/km0cv8vn_w500_h500.png',
                title: 'qiankun',
                desc: '可能是你见过最完善的微前端解决方案🧐',
                url: 'https://qiankun.umijs.org/',
            },
            {
                icon: 'https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg',
                title: '语雀',
                desc: '知识创作与分享工具',
                url: 'https://www.yuque.com/',
            },
            {
                icon: 'https://gw.alipayobjects.com/zos/rmsportal/LFooOLwmxGLsltmUjTAP.svg',
                title: 'Kitchen ',
                desc: 'Sketch 工具集',
                url: 'https://kitchen.alipay.com/',
            },
            {
                icon: 'https://gw.alipayobjects.com/zos/bmw-prod/d3e3eb39-1cd7-4aa5-827c-877deced6b7e/lalxt4g3_w256_h256.png',
                title: 'dumi',
                desc: '为组件开发场景而生的文档工具',
                url: 'https://d.umijs.org/zh-CN',
            },
        ]*/
    }
}