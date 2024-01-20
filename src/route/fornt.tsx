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
    UserOutlined,
    BankTwoTone
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

const getRootMenuItem = (menus: MenuOut[]): { icon:string, title:string, desc:string, url:string }[] => {
    return menus.map((menu) => {
        return {
            icon:"https://img0.baidu.com/it/u=3620010257,3904026948&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=557",
            title: menu.contentName,
            desc:"",
            url:url.front + "?menuId=" + menu.dataId
        }
    })
}

const getMenuDtoItem = (menuDto: MenuOut ) => {
    return menuDto.children.map((menu) => {
        return {
            name: menu.contentName,
            path: menu.contentUrl,
            component: menu.contentUrl,
            routes: getMenuDtoItem(menu)
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
                                    {title}
                                  </a>
                                )
                        } 
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