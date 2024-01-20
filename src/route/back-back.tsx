import React, { useEffect, useState } from 'react';
import { AppstoreTwoTone, BankTwoTone, LaptopOutlined, NotificationOutlined, PlusCircleTwoTone, PoweroffOutlined, RetweetOutlined, UserOutlined } from '@ant-design/icons';
import type { App, MenuProps } from 'antd';
import { Avatar, Breadcrumb, Button, Divider, Dropdown, Flex, Layout, Menu, Space, theme, Typography } from 'antd';
import { FileOut, HumanOut, MenuOut, PageConfigOut } from '../const/out.tsx';
import config from '../const/config';
import { getDataList, getDataOne } from '../const/http.tsx';
import PageWait from '../componet/PageWait.tsx';
import url from '../const/url.js';


const { Header, Content, Sider } = Layout;
const { Title } = Typography

type PageConfig = {
    companyName: string
    headerColor: string
    sideColor: string
}

const getRootMenuItem = (): MenuProps['items'] => {
    return [
        {
            key: 1,
            label: <a href={url.back + "?menuId=" + 1}>组织结构</a>
        }, {
            key: 2,
            label: <a href={url.back + "?menuId=" + 2}>权限管理</a>
        }, {
            key: 3,
            label: <a href={url.back + "?menuId=" + 3}>表单设置</a>
        }, {
            key: 4,
            label: <a href={url.back + "?menuId=" + 4}>知识目录</a>
        }, {
            key: 5,
            label: <a href={url.back + "?menuId=" + 5}>工作流程</a>
        }, {
            key: 6,
            label: <a href={url.back + "?menuId=" + 6}>数据展示</a>
        }, {
            key: 7,
            label: <a href={url.back + "?menuId=" + 7}>页面菜单</a>
        },
    ]
}

const getFirstPage = (menuId: string | null): string => {
    switch (parseInt(menuId ?? "1")) {
        case 7:
            return url.backUrl.menu
        case 6:
            return url.backUrl.search_list
        case 5:
            return url.backUrl.workflow
        case 4:
            return url.backUrl.content
        case 3:
            return url.backUrl.module
        case 2:
            return url.backUrl.character
        default:
            return url.backUrl.organization_tree
    }
}

const getMenuDtoItem = (menuId: string, onChange: (str: string) => void): MenuProps['items'] => {
    switch (parseInt(menuId)) {
        case 1:
            return [
                {
                    key: 1,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.organization_tree)
                            }}
                            color='#ffffff'
                        >
                            组织结构树
                        </Button>
                    )
                }, {
                    key: 2,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.section)
                            }}
                            color='#ffffff'
                        >
                            分部列表
                        </Button>
                    )
                }, {
                    key: 3,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.depart)
                            }}
                            color='#ffffff'
                        >
                            部门列表
                        </Button>
                    )
                }, {
                    key: 4,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.section)
                            }}
                            color='#ffffff'
                        >
                            人员列表
                        </Button>
                    )
                },
            ]
        case 2:
            return [
                {
                    key: 1,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.character)
                            }}
                            color='#ffffff'
                        >
                            角色列表
                        </Button>
                    )
                }
            ]
        case 3:
            return [
                {
                    key: 1,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.module)
                            }}
                            color='#ffffff'
                        >
                            应用列表
                        </Button>
                    )
                }, {
                    key: 2,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.table)
                            }}
                            color='#ffffff'
                        >
                            表单列表
                        </Button>
                    )
                }, {
                    key: 3,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.column)
                            }}
                            color='#ffffff'
                        >
                            字段列表
                        </Button>
                    )
                }
            ]
        case 4:
            return [
                {
                    key: 1,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.content)
                            }}
                            color='#ffffff'
                        >
                            目录列表
                        </Button>
                    )
                },
            ]
        case 5:
            return [
                {
                    key: 1,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.workflow)
                            }}
                            color='#ffffff'
                        >
                            流程列表
                        </Button>
                    )
                }, {
                    key: 1,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.workflow_route)
                            }}
                            color='#ffffff'
                        >
                            路径列表
                        </Button>
                    )
                }, {
                    key: 1,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.workflow_node)
                            }}
                            color='#ffffff'
                        >
                            节点列表
                        </Button>
                    )
                }, {
                    key: 1,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.request)
                            }}
                            color='#ffffff'
                        >
                            流程监控
                        </Button>
                    )
                },
            ]
        case 6:
            return [
                {
                    key: 1,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.search_list)
                            }}
                            color='#ffffff'
                        >
                            展示列表
                        </Button>
                    )
                }, {
                    key: 2,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.search_list_column)
                            }}
                            color='#ffffff'
                        >
                            展示字段列表
                        </Button>
                    )
                },
            ]
        case 7:
            return [
                {
                    key: 1,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.menu)
                            }}
                            color='#ffffff'
                        >
                            页面菜单
                        </Button>
                    )
                }, {
                    key: 1,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.login_config)
                            }}
                            color='#ffffff'
                        >
                            登录设置
                        </Button>
                    )
                }, {
                    key: 1,
                    label: (
                        <Button
                            type='link'
                            onClick={() => {
                                onChange(url.backUrl.page_config)
                            }}
                            color='#ffffff'
                        >
                            页面设置
                        </Button>
                    )
                },
            ]
    }
}

const HumanAvater = (prop: { humanSelf: HumanOut, humanPhoto: FileOut | undefined }) => {
    let avater
    if (prop.humanPhoto !== undefined)
        avater = <Avatar shape="square" size={16} src={config.backUrl + prop.humanPhoto.fileRoute} />
    else
        avater = <Avatar shape="square" size={16} icon={<UserOutlined />} />

    return (
        <Space align='center' style={{ display: "flex" }} size='middle'>
            <Divider type="vertical" style={{ color: "#d9d9d9" }} />
            <Dropdown
                menu={{
                    items: [
                        {
                            key: 'self',
                            label: (
                                <a href={url.frontUrl.humanResource + prop.humanSelf.dataId}>
                                    <UserOutlined />
                                    个人信息
                                </a>
                            )
                        }, {
                            key: 'jump',
                            label: (
                                <a href={url.front}>
                                    <RetweetOutlined />
                                    前台用户中心
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
                }} >
                <Space align='center' style={{ display: "flex" }} size='small'>
                    {avater}
                    <Title level={4} style={{ color: "#ffffff" }}>{prop.humanSelf.name}</Title>
                </Space>
            </Dropdown>
        </Space>
    )
}

const BackPage: React.FC = () => {
    const menuId = new URLSearchParams(window.location.search.substring(1)).get("menuId")
    const [humanSelf, setHumanSelf] = useState<HumanOut>()
    const [humanPhoto, setHumanPhoto] = useState<FileOut>()
    const [pageConfig, setPageConfig] = useState<PageConfig>()
    const [aimUrl, setAimUrl] = useState<string>(getFirstPage(menuId))
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
                if (value.success)
                    setHumanSelf(value.data)
                if (value.data.photo !== undefined && value.data.photo != null && value.data.photo !== 0)
                    getDataOne(config.fronts.file + "/" + value.data.photo).then((photo) => {
                        if (photo.success)
                            setHumanPhoto(photo.data)
                    })
            })
        }
    })


    if (pageConfig === undefined || humanSelf == undefined)
        return <PageWait />

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }} hasSider>
                <Space align='center' style={{ backgroundColor: pageConfig?.headerColor, display: 'flex' }}>
                    <div style={{ width: "200" }}><Title level={3} color='#ffffff'></Title></div>
                    <BankTwoTone href={""} />
                    <Dropdown
                        menu={{ items: getRootMenuItem() }}>
                        <Space>
                            <AppstoreTwoTone />
                            引擎
                        </Space>
                    </Dropdown>
                    <Space />
                    <Sider width={200}>
                        <HumanAvater humanSelf={humanSelf} humanPhoto={humanPhoto} />
                    </Sider>
                </Space>
            </Header>
            <Layout>
                <Sider width={200} style={{ background: pageConfig.sideColor }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={getMenuDtoItem(menuId ?? "1", (str: string) => { if (str) setAimUrl(str) })}
                    />
                </Sider>
                <Content>
                    <iframe height="99%" width="99%" src={aimUrl} style={{ border: "none" }} />
                </Content>
            </Layout>
        </Layout>
    );
};

export default BackPage;