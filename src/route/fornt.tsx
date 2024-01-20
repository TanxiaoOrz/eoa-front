import {
    CaretDownFilled,
    DoubleRightOutlined,
    GithubFilled,
    InfoCircleFilled,
    LogoutOutlined,
    PlusCircleFilled,
    QuestionCircleFilled,
    SearchOutlined,
    ChromeFilled,
    CrownFilled,
    SmileFilled,
    TabletFilled,
    PoweroffOutlined,
    RetweetOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import {
    PageContainer,
    ProCard,
    ProConfigProvider,
    ProLayout,
    SettingDrawer,
} from '@ant-design/pro-components';
import {
    Button,
    ConfigProvider,
    Divider,
    Dropdown,
    Input,
    Popover,
    theme,
} from 'antd';
import React, { useEffect, useState } from 'react';
import url from '../const/url';
import { HumanOut, FileOut, MenuOut } from '../const/out.tsx';
import PageWait from '../componet/PageWait.tsx';
import config from '../const/config.js';
import { getDataOne, getDataList } from '../const/http.tsx';

type PageConfig = {
    companyName: string
    headerColor: string
    sideColor: string
}

const defaultProps = {
    route: {
        path: '/',
        routes: [
            {
                path: '/welcome',
                name: '欢迎',
                icon: <SmileFilled />,
                component: './Welcome',
            },
            {
                path: '/admin',
                name: '管理页',
                icon: <CrownFilled />,
                access: 'canAdmin',
                component: './Admin',
                routes: [
                    {
                        path: '/admin/sub-page1',
                        name: '一级页面',
                        icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
                        component: './Welcome',
                    },
                    {
                        path: '/admin/sub-page2',
                        name: '二级页面',
                        icon: <CrownFilled />,
                        component: './Welcome',
                    },
                    {
                        path: '/admin/sub-page3',
                        name: '三级页面',
                        icon: <CrownFilled />,
                        component: './Welcome',
                    },
                ],
            },
            {
                name: '列表页',
                icon: <TabletFilled />,
                path: '/list',
                component: './ListTableList',
                routes: [
                    {
                        path: '/list/sub-page',
                        name: '列表页面',
                        icon: <CrownFilled />,
                        component:'/login',
                        routes: [
                            {
                                path: 'sub-sub-page1',
                                name: '一一级列表页面',
                                icon: <CrownFilled />,
                                component: './Welcome',
                            },
                            {
                                path: 'sub-sub-page2',
                                name: '一二级列表页面',
                                icon: <CrownFilled />,
                                component: './Welcome',
                            },
                            {
                                path: 'sub-sub-page3',
                                name: '一三级列表页面',
                                icon: <CrownFilled />,
                                component: './Welcome',
                            },
                        ],
                    },
                    {
                        path: '/list/sub-page2',
                        name: '二级列表页面',
                        icon: <CrownFilled />,
                        component: './Welcome',
                    },
                    {
                        path: '/list/sub-page3',
                        name: '三级列表页面',
                        icon: <CrownFilled />,
                        component: './Welcome',
                    },
                ],
            },

        ],
    },
    location: {
        pathname: '/',
    },
    appList: [
        {
            icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
            title: 'Ant Design',
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
    ],
};


export default () => {
    const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
        fixSiderbar: true,
        layout: 'mix',
        splitMenus: true,
    });

    const menuId = new URLSearchParams(window.location.search.substring(1)).get("menuId")
    const [humanSelf, setHumanSelf] = useState<HumanOut>()
    const [humanPhoto, setHumanPhoto] = useState<FileOut>()
    const [menuRoots, setMenuRoots] = useState<MenuOut[]>()
    const [menuDto, setMenuDto] = useState<MenuOut>()
    const [pageConfig, setPageConfig] = useState<PageConfig>()
    const [aimUrl, setAimUrl] = useState<string>()



    const [pathname, setPathname] = useState('/list/sub-page/sub-sub-page1');

    useEffect(() => {
        if (pageConfig === undefined)
            getDataOne(config.fronts.page_config).then((value) => {
                if (value.success)
                    setPageConfig(value.data)
                else
                    setPageConfig({
                        companyName: "EOA",
                        headerColor: "#FFC89A",
                        sideColor: "#ABA09F"
                    })

            })
    })
    useEffect(() => {
        if (humanSelf === undefined) {
            getDataOne(config.fronts.human_self).then((value) => {
                if (value.success) {
                    setHumanSelf(value.data)
                    if (value.data.photo !== undefined && value.data.photo != null && value.data.photo !== 0)
                        getDataOne(config.fronts.file + "/" + value.data.photo).then((value) => {
                            if (value.success)
                                setHumanPhoto(value.data)
                        })
                }
            })
        }
    })
    useEffect(() => {
        if (menuRoots === undefined) {
            getDataList(config.fronts.menu).then((value) => {
                if (value.success)
                    setMenuRoots(value.data)
            })
        }
    })
    useEffect(() => {
        if (menuDto === undefined) {
            // console.log("menuId",menuId ?? 1)
            getDataOne(config.fronts.menu + "/" + (menuId ?? 1)).then((value) => {
                if (value.success) {
                    setMenuDto(value.data)
                    setAimUrl((value.data as MenuOut).contentUrl)
                }

            })
        }
    })

    if (pageConfig === undefined || pageConfig === null || menuRoots === undefined || menuDto === undefined || humanSelf == undefined)
        return <PageWait />

    if (typeof document === 'undefined') {
        return <div />;
    }
    return (
        <div
            id="test-pro-layout"
            style={{
                height: '100vh',
                overflow: 'auto',
            }}
        >
            <ProConfigProvider hashed={false}>
                <ConfigProvider
                    getTargetContainer={() => {
                        return document.getElementById('test-pro-layout') || document.body;
                    }}
                >
                    <ProLayout
                        prefixCls="my-prefix"
                        token={{
                            colorBgAppListIconHover: 'rgba(0,0,0,0.06)',
                            colorTextAppListIconHover: 'rgba(255,255,255,0.95)',
                            colorTextAppListIcon: 'rgba(255,255,255,0.85)',
                            sider: {
                                colorBgCollapsedButton: '#fff',
                                colorTextCollapsedButtonHover: 'rgba(0,0,0,0.65)',
                                colorTextCollapsedButton: 'rgba(0,0,0,0.45)',
                                colorMenuBackground: pageConfig.sideColor,
                                colorBgMenuItemCollapsedElevated: 'rgba(0,0,0,0.85)',
                                colorMenuItemDivider: 'rgba(255,255,255,0.15)',
                                colorBgMenuItemHover: 'rgba(0,0,0,0.06)',
                                colorBgMenuItemSelected: 'rgba(0,0,0,0.15)',
                                colorTextMenuSelected: '#fff',
                                colorTextMenuItemHover: 'rgba(255,255,255,0.75)',
                                colorTextMenu: 'rgba(255,255,255,0.75)',
                                colorTextMenuSecondary: 'rgba(255,255,255,0.65)',
                                colorTextMenuTitle: 'rgba(255,255,255,0.95)',
                                colorTextMenuActive: 'rgba(255,255,255,0.95)',
                                colorTextSubMenuSelected: '#fff',
                            },
                            header: {
                                colorBgHeader: pageConfig.headerColor,
                                colorBgRightActionsItemHover: 'rgba(0,0,0,0.06)',
                                colorTextRightActionsItem: 'rgba(255,255,255,0.65)',
                                colorHeaderTitle: '#fff',
                                colorBgMenuItemHover: 'rgba(0,0,0,0.06)',
                                colorBgMenuItemSelected: 'rgba(0,0,0,0.15)',
                                colorTextMenuSelected: '#fff',
                                colorTextMenu: 'rgba(255,255,255,0.75)',
                                colorTextMenuSecondary: 'rgba(255,255,255,0.65)',
                                colorTextMenuActive: 'rgba(255,255,255,0.95)',
                            },
                        }}
                        bgLayoutImgList={[
                            {
                                src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
                                left: 85,
                                bottom: 100,
                                height: '303px',
                            },
                            {
                                src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
                                bottom: -68,
                                right: -45,
                                height: '303px',
                            },
                            {
                                src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
                                bottom: 0,
                                left: 0,
                                width: '331px',
                            },
                        ]}
                        {...defaultProps}
                        location={{
                            pathname,
                        }}
                        siderMenuType="group"
                        menu={{
                            collapsedShowGroupTitle: true,
                        }}
                        headerTitleRender={
                            (logo, title, _) =>  (
                                  <a href='/'>
                                    {logo}
                                    {title}
                                  </a>
                                )
                        } 
                        avatarProps={{
                            src: humanPhoto?.fileRoute ?? 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
                            size: 'small',
                            title: '七妮妮',
                            render: (props, dom) => {
                                return (
                                    <Dropdown
                                        menu={{
                                            items: [
                                                {
                                                    key: 'self',
                                                    label: (
                                                        <a href={url.frontUrl.humanResource + humanSelf.dataId}>
                                                            <UserOutlined />
                                                            个人信息
                                                        </a>
                                                    )
                                                }, {
                                                    key: 'jump',
                                                    label: (
                                                        <a href={url.back}>
                                                            <RetweetOutlined />
                                                            后台应用中心
                                                        </a>
                                                    )
                                                }, {
                                                    key: 'exit',
                                                    label: (
                                                        <a href={url.login}>
                                                            <PoweroffOutlined />
                                                            退出登录
                                                        </a>
                                                    )
                                                }
                                            ],
                                        }}
                                    >
                                        {dom}
                                    </Dropdown>
                                );
                            },
                        }}
                        onMenuHeaderClick={(e) => console.log(e)}
                        menuItemRender={(item, dom) => (
                            <div
                                onClick={() => {
                                    setAimUrl(item.path);
                                }}
                            >
                                {dom}
                            </div>
                        )}
                        {...settings}
                    >
                        <iframe height="110%" width="100%" src={aimUrl} style={{ border: "none" }} />
                    </ProLayout>
                </ConfigProvider>
            </ProConfigProvider>
        </div>
    );
};