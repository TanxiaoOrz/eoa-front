import {
    AppstoreOutlined,
    CrownFilled,
    OrderedListOutlined,
    PoweroffOutlined,
    RetweetOutlined,
    UserOutlined} from '@ant-design/icons';
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
import { HumanOut, FileOut } from '../const/out.tsx';
import PageWait from '../componet/PageWait.tsx';
import config from '../const/config.js';
import { getDataOne } from '../const/http.tsx';

type PageConfig = {
    companyName: string
    headerColor: string
    sideColor: string
}

const getRootMenuItem = (): { icon:string, title:string, desc:string, url:string }[] => {
    return [
        {
            icon:"https://s1.4sai.com/src/img/png/78/7874765f26ea464b990b81adf2ddf9da.png?imageMogr2/auto-orient/thumbnail/!282x282r/gravity/Center/crop/282x282/quality/85/%7CimageView2/2/w/282&e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:XOi0XSIDOemG6R2Teld8BlSVL_Y=",
            title:"组织结构",
            desc:"",
            url: url.back + "?menuId=" + 1
        }, {
            icon:"https://s1.4sai.com/src/img/png/58/5809d036608c409087cbcd68107a90c7.png?imageMogr2/auto-orient/thumbnail/!282x282r/gravity/Center/crop/282x282/quality/85/%7CimageView2/2/w/282&e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:-eHHvQj_4mpd-kkdTC28iSMwd2o=",
            title:"权限管理",
            desc:"",
            url: url.back + "?menuId=" + 2
        }, {
            icon:"https://s1.4sai.com/src/img/png/7c/7cb2a5c692d846cc97ce03243067e267.png?imageMogr2/auto-orient/thumbnail/!282x282r/gravity/Center/crop/282x282/quality/85/%7CimageView2/2/w/282&e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:E2W8w7fmHLebCMV45WnS7RzkL50=",
            title:"表单模块",
            desc:"",
            url: url.back + "?menuId=" + 3
        }, {
            icon:"https://s1.aigei.com/src/img/png/73/73461f9e8b1843ff9e92a1cafc4bfb65.png?imageMogr2/auto-orient/thumbnail/!282x282r/gravity/Center/crop/282x282/quality/85/%7CimageView2/2/w/282&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:XV5nJr1GvNe6VkLQrYvMAZHkn_A=",
            title:"知识目录",
            desc:"",
            url: url.back + "?menuId=" + 4
        }, {
            icon:"https://s1.aigei.com/src/img/png/1e/1e7f256a13f34e6786827b54077e380c.png?imageMogr2/auto-orient/thumbnail/!282x282r/gravity/Center/crop/282x282/quality/85/%7CimageView2/2/w/282&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:TaxWkv6awhs2xrpgZGhvceiRHAQ=",
            title:"工作流程",
            desc:"",
            url: url.back + "?menuId=" + 5
        }, {
            icon:"https://s1.aigei.com/src/img/png/14/14e795b3eeba4a408d3c6e469bd4d65c.png?imageMogr2/auto-orient/thumbnail/!282x282r/gravity/Center/crop/282x282/quality/85/%7CimageView2/2/w/282&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:mIibNNDwKIFTFKXkMC8J5L5MBu8=",
            title:"数据展示",
            desc:"",
            url: url.back + "?menuId=" + 6
        }, {
            icon:"https://s1.aigei.com/src/img/png/b8/b8896eff5c7749c7975b6358913bd690.png?imageMogr2/auto-orient/thumbnail/!282x282r/gravity/Center/crop/282x282/quality/85/%7CimageView2/2/w/282&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:zc7hb90ZQmOw_yprdGws9F7jf08=",
            title:"页面菜单",
            desc:"",
            url: url.back + "?menuId=" + 7
        },
    ]
}

const getMenuDtoItem = (menuId: string| null ) => {
    switch (parseInt(menuId ?? "1")) {
        
        case 2:
            return [
                {
                    name:"角色列表",
                    path:url.backUrl.character,
                    component:url.backUrl.character,
                    routes:[],
                }
            ]
        case 3:
            return [
                {
                    name:"应用列表",
                    path:url.backUrl.module,
                    component:url.backUrl.module,
                    routes:[],
                }, {
                    name:"表单列表",
                    path:url.backUrl.table,
                    component:url.backUrl.table,
                    routes:[],
                }, {
                    name:"字段列表",
                    path:url.backUrl.column,
                    component:url.backUrl.column,
                    routes:[],
                }
            ]
        case 4:
            return [
                {
                    name:"目录列表",
                    path:url.backUrl.content,
                    component:url.backUrl.content,
                    routes:[],
                },
            ]
        case 5:
            return [
                {
                    name:"流程列表",
                    path:url.backUrl.workflow,
                    component:url.backUrl.workflow,
                    routes:[],
                }, {
                    name:"路径列表",
                    path:url.backUrl.workflow_route,
                    component:url.backUrl.workflow_route,
                    routes:[],
                }, {
                    name:"节点列表",
                    path:url.backUrl.workflow_node,
                    component:url.backUrl.workflow_node,
                    routes:[],
                }, {
                    name:"流程监控",
                    path:url.backUrl.request,
                    component:url.backUrl.request,
                    routes:[],
                },
            ]
        case 6:
            return [
                {
                    name:"展示列表",
                    path:url.backUrl.search_list,
                    component:url.backUrl.search_list,
                    routes:[],
                }, {
                    name:"展示字段列表",
                    path:url.backUrl.search_list_column,
                    component:url.backUrl.search_list_column,
                    routes:[],
                },
            ]
        case 7:
            return [
                {
                    name:"页面菜单",
                    path:url.backUrl.menu,
                    component:url.backUrl.menu,
                    routes:[],
                }, {
                    name:"登录设置",
                    path:url.backUrl.login_config,
                    component:url.backUrl.login_config,
                    routes:[],
                }, {
                    name:"页面设置",
                    path:url.backUrl.page_config,
                    component:url.backUrl.page_config,
                    routes:[],
                },
            ]
            default:
            return [
                {
                    name:"组织结构树",
                    path:url.backUrl.organization_tree,
                    component:url.backUrl.organization_tree,
                    routes:[],
                }, {
                    name:"分部列表",
                    path:url.backUrl.section,
                    component:url.backUrl.section,
                    routes:[],
                }, {
                    name:"部门列表",
                    path:url.backUrl.depart,
                    component:url.backUrl.depart,
                    routes:[],
                }, {
                    name:"人员列表",
                    path:url.backUrl.human,
                    component:url.backUrl.human,
                    routes:[],
                },
            ]
    }
}

export default () => {
    const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
        fixSiderbar: true,
        layout: 'mix',
        splitMenus: true,
    });

    const menuId = new URLSearchParams(window.location.search.substring(1)).get("menuId")
    const root = getRootMenuItem()
    const routes = getMenuDtoItem(menuId??"1")
    const nowRoote = {
        title:root[parseInt(menuId??'1')-1].title,
        url:routes[0].path
    }
    
    const [humanSelf, setHumanSelf] = useState<HumanOut>()
    const [humanPhoto, setHumanPhoto] = useState<FileOut>()
    const [pageConfig, setPageConfig] = useState<PageConfig>()
    const [pathname, setPathname] = useState<string>(nowRoote.url)

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
    useEffect(()=>{
        document.body.style.overflow = 'hidden'
    })

    

    if (pageConfig === undefined || pageConfig === null || humanSelf == undefined)
        return <PageWait />

    if (typeof document === 'undefined') {
        return <PageWait />;
    }

    

    const defaultProps = {
        route: {
            path: '/',
            routes: [
                {
                    path: nowRoote.url,
                    name: nowRoote.title,
                    icon: <CrownFilled />,
                    access: nowRoote.url,
                    component: nowRoote.url,
                    routes: routes
                },
            ],
        },
        location: {
            pathname:'/'
        },
        appList: root
    };

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
                            (logo, title, _) =>  (
                                  <a href='/' >
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
                                                        <Button type='link' onClick={()=>{window.open(url.frontUrl.humanResource + humanSelf.dataId)}}>
                                                            <UserOutlined />
                                                            个人信息
                                                        </Button>
                                                    )
                                                }, {
                                                    key: 'jump',
                                                    label: (
                                                        <Button type='link' onClick={()=>{window.open(url.front)}}>
                                                            <RetweetOutlined />
                                                            前台应用中心
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
                        actionsRender={(props) => {
                            if (props.isMobile) return [];
                            if (typeof window === 'undefined') return [];
                            return [
                                <p key={"Text"}>后台引擎中心</p>,
                                <AppstoreOutlined key='app' />
                            ];
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
                                        setPathname((item.path)as unknown as string);
                                }}
                            >
                                {dom}
                            </div>
                        )}
                        {...settings}
                    >
                        <iframe title='page' width="100%" src={pathname} style={{ border: "none", display:"block", height:"88vh", overflowX:'hidden'}} />
                    </ProLayout>
                </ConfigProvider>
            </ProConfigProvider>
        </div>
    );
};