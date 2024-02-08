import {
    AppstoreAddOutlined,
    CrownFilled,
    PoweroffOutlined,
    RetweetOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import {
    ProConfigProvider,
    ProLayout,
} from '@ant-design/pro-components';
import {
    Button,
    ConfigProvider,
    Dropdown,
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

const getRootMenuItem = (menus: MenuOut[]): { icon: string, title: string, desc: string, url: string }[] => {
    return menus.map((menu) => {
        return {
            icon: "https://s1.4sai.com/src/img/png/f2/f2af6b24a3b945bfa197de975b8f74f6.png?imageView2/2/w/149&e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:DLsrVwDdI58ylYSEIhrE7mBSCh8=",
            title: menu.contentName,
            desc: "",
            url: url.front + "?menuId=" + menu.dataId
        }
    })
}

const getMenuDtoItem = (menuDto: MenuOut) => {
    return menuDto.children.map((menu) => {
        return {
            name: menu.contentName,
            path: menu.contentUrl,
            component: menu.contentUrl,
            children: getMenuDtoItem(menu)
        }
    })
}

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
    const [pathname, setPathname] = useState<string>()

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
                    setPathname((value.data as MenuOut).contentUrl)
                }

            })
        }
    })
    useEffect(() => {
        document.body.style.overflow = 'hidden'
    })



    if (pageConfig === undefined || pageConfig === null || menuRoots === undefined || menuDto === undefined || humanSelf == undefined)
        return <PageWait />

    if (typeof document === 'undefined') {
        return <PageWait />;
    }

    const defaultProps = {
        route: {
            path: '/',
            routes: [
                {
                    path: menuDto?.contentUrl,
                    name: menuDto?.contentName,
                    icon: <CrownFilled />,
                    access: menuDto?.contentUrl,
                    component: menuDto?.contentUrl,
                    routes: getMenuDtoItem(menuDto)
                },
            ],
        },
        location: {
            pathname: '/',
        },
        appList: getRootMenuItem(menuRoots)
    };
    console.log("menuRoots", menuRoots)
    console.log("defaultProps", defaultProps)
    return (
        <div
            id="test-pro-layout"
            style={{
                height: '100vh',

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
                        title={pageConfig.companyName}
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
                        {...defaultProps}
                        location={{
                            pathname,
                        }}
                        siderMenuType="group"
                        menu={{
                            collapsedShowGroupTitle: true,
                        }}
                        headerTitleRender={
                            (logo, title, _) => (
                                <a href='/'>
                                    {title}
                                </a>
                            )
                        }
                        actionsRender={(props) => {
                            if (props.isMobile) return [];
                            if (typeof window === 'undefined') return [];
                            return [
                                <p key={"Text"}>前台应用中心</p>,
                                <AppstoreAddOutlined key='icon'/>
                            ];
                        }}
                        avatarProps={{
                            src: humanPhoto?.fileRoute ?? 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
                            size: 'small',
                            title: humanSelf.name,
                            render: (props, dom) => {
                                return (
                                    <Dropdown
                                        menu={{
                                            items: [
                                                {
                                                    key: 'self',
                                                    label: (
                                                        <Button type='link' onClick={() => { window.open(url.frontUrl.humanResource + humanSelf.dataId) }}>
                                                            <UserOutlined />
                                                            个人信息
                                                        </Button>
                                                    )
                                                }, {
                                                    key: 'jump',
                                                    label: (
                                                        <Button type='link' onClick={() => { window.open(url.back) }}>
                                                            <RetweetOutlined />
                                                            后台引擎中心
                                                        </Button>
                                                    )
                                                }, {
                                                    key: 'exit',
                                                    label: (
                                                        <Button type='link' danger href={url.login}>
                                                            <PoweroffOutlined />
                                                            退出登录
                                                        </Button>
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
                        menuFooterRender={(props) => {
                            if (props?.collapsed) return undefined;
                            return (
                                <div
                                    style={{
                                        textAlign: 'center',
                                        paddingBlockStart: 12,
                                    }}
                                >
                                    <div>© 2024 Made with love</div>
                                    <div>by Zhang JunShan</div>
                                </div>
                            );
                        }}
                        menuItemRender={(item, dom) => (
                            <div
                                onClick={() => {
                                    if (item.path)
                                        setPathname(item.path);
                                }}
                            >
                                {dom}
                            </div>
                        )}
                        {...settings}
                    >
                        <iframe title='page' width="100%" src={pathname} style={{ border: "none", display: "block", height: "100vh", overflowX: 'hidden' }} />
                    </ProLayout>
                </ConfigProvider>
            </ProConfigProvider>
        </div>
    );
};