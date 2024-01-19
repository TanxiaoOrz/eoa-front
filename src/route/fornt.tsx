import React, { useEffect, useState } from 'react';
import { AppstoreTwoTone, BankTwoTone, LaptopOutlined, NotificationOutlined, PlusCircleTwoTone, PoweroffOutlined, RetweetOutlined, UserOutlined } from '@ant-design/icons';
import type { App, MenuProps } from 'antd';
import { Avatar, Breadcrumb, Button, Divider, Dropdown, Flex, Layout, Menu, Space, theme, Typography } from 'antd';
import { FileOut, HumanOut, MenuOut, PageConfigOut } from '../const/out';
import config from '../const/config';
import { getDataList, getDataOne } from '../const/http';
import { getValue } from '@testing-library/user-event/dist/utils';
import PageWait from '../componet/PageWait';
import url from '../const/url';


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
                <a href={url.front+"?menuId=" + menu.dataId} >
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
    const [aimUrl, setUrl] = useState<string>()
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
    useEffect(() => {
        if (menuRoots === undefined) {
            getDataList(config.fronts.menu).then((value) => {
                if (value.success)
                    setMenuRoots(menuRoots)
            })
        }
    })
    useEffect(() => {
        if (menuDto === undefined)
            getDataOne(config.fronts.menu + "/" + menuId ?? 1).then((value) => {
                if (value.success) {
                    setMenuDto(value.data)
                    setUrl((value.data as MenuOut).contentUrl)
                }

            })
    })

    if (pageConfig === undefined || menuRoots === undefined || menuDto === undefined || humanSelf == undefined)
        return <PageWait />

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }} hasSider>
                <Space align='center' style={{ backgroundColor: pageConfig?.headerColor, display: 'flex' }}>
                    <div style={{ width: "200" }}><Title level={3} color='#ffffff'></Title></div>
                    <BankTwoTone href={""} />
                    <Dropdown
                        menu={{ items: getRootMenuItem(menuRoots) }}>
                        <Space>
                            <AppstoreTwoTone />
                            应用
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
                        items={getMenuDtoItem(menuDto, (str: string) => { if (str) setUrl(str) })}
                    />
                </Sider>
                <Content>
                    <iframe height="99%" width="99%" src={aimUrl} style={{border:"none"}}/>
                </Content>
            </Layout>
        </Layout>
    );
};

export default FrontPage;