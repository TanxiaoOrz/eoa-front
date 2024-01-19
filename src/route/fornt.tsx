import React, { useEffect, useState } from 'react';
import { AppstoreTwoTone, BankTwoTone, LaptopOutlined, NotificationOutlined, PlusCircleTwoTone, PoweroffOutlined, RetweetOutlined, UserOutlined } from '@ant-design/icons';
import type { App, MenuProps } from 'antd';
import { Avatar, Breadcrumb, Button, Divider, Dropdown, Flex, Layout, Menu, Space, theme, Typography } from 'antd';
import { FileOut, HumanOut, MenuOut, PageConfigOut } from '../const/out.tsx';
import config from '../const/config';
import { getDataList, getDataOne } from '../const/http.tsx';
import { getValue } from '@testing-library/user-event/dist/utils';
import PageWait from '../componet/PageWait.tsx';
import url from '../const/url.js';


const { Header, Content, Sider } = Layout;
const { Title } = Typography

type PageConfig = {
    companyName: string
    headerColor: string
    sideColor: string
}

const getRootMenuItem = (menus: MenuOut[]): MenuProps['items'] => {
    return menus.map((menu) => {
        return {
            key: menu.dataId,
            label: (
                <a href={url.front + "?menuId=" + menu.dataId} >
                    {menu.contentName}
                </a>
            )
        }
    })
}

const getMenuDtoItem = (menuDto: MenuOut, onChange: (str: string) => void): MenuProps['items'] => {
    return menuDto.children.map((menu) => {
        return {
            key: menu.dataId,
            label: (
                <Button
                    type='link'
                    onClick={() => {
                        onChange(menu.contentUrl)
                    }}
                    color='#ffffff'
                >
                    {menu.contentName}
                </Button>
            ),
            children: getMenuDtoItem(menu, onChange)
        }
    })
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
                }} >
                <Space align='center' style={{ display: "flex" }} size='small'>
                    {avater}
                    <Title level={4} style={{ color: "#ffffff" }}>{prop.humanSelf.name}</Title>
                </Space>
            </Dropdown>
        </Space>
    )
}

const FrontPage: React.FC = () => {
    const menuId = new URLSearchParams(window.location.search.substring(1)).get("menuId")
    const [humanSelf, setHumanSelf] = useState<HumanOut>()
    const [humanPhoto, setHumanPhoto] = useState<FileOut>()
    const [menuRoots, setMenuRoots] = useState<MenuOut[]>()
    const [menuDto, setMenuDto] = useState<MenuOut>()
    const [pageConfig, setPageConfig] = useState<PageConfig>()
    const [aimUrl, setAimUrl] = useState<string>()
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

    console.log("menuDto", menuDto, getMenuDtoItem(menuDto, (str: string) => { if (str) setAimUrl(str) }))

    return (
        <Layout style={{ height: "98vh" }}>
            <Header style={{ display: 'flex', alignItems: 'center', width: '100%', color: pageConfig?.headerColor}} hasSider>
                <Space align='center' style={{ backgroundColor: pageConfig?.headerColor, display: 'flex', width: "100vh" }}>
                    <Space align='center' style={{ display: "flex" }} size='middle'>

                        <div style={{ width: "200", backgroundColor: pageConfig?.headerColor }}><Title level={3} color='#ffffff'>{pageConfig.companyName}</Title></div>
                        <BankTwoTone href={""} />
                        <Dropdown
                            menu={{ items: getRootMenuItem(menuRoots) }}>
                            <Space>
                                <AppstoreTwoTone />
                                应用
                            </Space>
                        </Dropdown>
                    </Space>
                    <Space />
                    <Sider width={200} style={{ flex: "right" }}>
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
                        items={getMenuDtoItem(menuDto, (str: string) => { if (str) setAimUrl(str) })}
                    />
                </Sider>
                <Content>
                    <iframe height="99%" width="99%" src={aimUrl} style={{ border: "none" }} />
                </Content>
            </Layout>
        </Layout>
    );
};

export default FrontPage;