import React, { useState, useEffect } from "react"
import { UpdateData, deleteData, getDataList, getDataOne } from "../../const/http.tsx"
import { MenuOut } from "../../const/out.tsx"
import config from "../../const/config"
import { Button, Form } from "antd"
import { PageContainer, ProForm, ProFormDatePicker, ProFormDigit, ProFormGroup, ProFormText, ProFormTreeSelect } from "@ant-design/pro-components"
import { useParams } from "react-router"
import url from "../../const/url"
import PageWait from "../../componet/PageWait.tsx"
import { AuthorityEdit } from "../../componet/AuthorityEdit.tsx"
import BackMenuList from "./back_menu.tsx"


type MenuIn = {
    contentName: string
    belongContent: number
    contentUrl: string
    viewNumber: number
    shareAuthority: string
}


const BackMenuConcrete = () => {
    const menuId = useParams().dataId
    const [form] = Form.useForm<MenuIn>()
    const [menu, setMenu] = useState<MenuOut>()

    useEffect(() => {
        if (menu === undefined)
            getDataOne(config.backs.menu + "/" + menuId).then((value) => {
                console.log(value.data)
                if (value.success) {
                    setMenu(value.data)
                }
            })
    })
    useEffect(() => {
        document.title = '页面菜单-' + menu?.contentName
    }, [menu?.contentName])

    if (menuId === undefined) {
        window.location.replace(url.backUrl.menu)
        return (<div></div>)
    }

    if (menu === undefined)
        return (<PageWait />)


    const dropMenu = async () => {
        if ((await deleteData(config.backs.menu + "/" + menuId)))
            setTimeout(() => window.close(), 1000)
    }

    const MenuBase = (
        <div style={{ display: "flex", background: "#fdfdfd", paddingTop: "30px", paddingLeft: "10px" }}>
            <ProForm<MenuIn>
                form={form}
                style={{
                    margin: "0 auto",
                    minHeight: "90vh"
                }}
                submitter={false}
                layout="horizontal"
                initialValues={menu}
                onFinish={async (menuIn: MenuIn) => {
                    menuIn.shareAuthority = menu.shareAuthority
                    if (await UpdateData(config.backs.menu + "/" + menuId, menuIn)) {
                        setTimeout(() => window.location.reload(), 1000)
                        return true
                    } else
                        return false
                }}
            >
                <ProFormGroup size={"large"} title="基本信息">
                    <ProFormText
                        width="md"
                        name="contentName"
                        label="菜单名称"
                        tooltip="最长为33位"
                        placeholder="请输入菜单名称"
                        required={true} />
                    <ProFormTreeSelect
                        width="md"
                        name="belongContent"
                        label="上级菜单"
                        placeholder="请选择所属模块"
                        tooltip="置空代表根菜单"
                        required={true}
                        request={async () => {
                            let menuList: MenuOut[] = (await getDataList(config.backs.menu, { toBrowser: true })).data
                            const values: { title: string, value: number, children: any[] }[] = menuList.map(
                                (item) => {
                                    return { title: item.contentName, value: item.dataId, children: [] };
                                })
                            return values
                        }} />
                    <ProFormText
                        width="md"
                        name="contentUrl"
                        label="菜单链接"
                        tooltip="最长为333位"
                        placeholder="请输入菜单链接"
                        required={true} />
                    <ProFormDigit
                        width={'md'}
                        name={'viewNo'}
                        label={'显示顺序'}
                        placeholder={"不输入自动排到最后"}
                        fieldProps={{ precision: 0 }} />
                </ProFormGroup>
                <ProFormGroup size={"large"} title="创建信息">
                    <ProFormDatePicker
                        disabled
                        name="createTime"
                        label="创建时间"
                        width="md" />
                    <ProFormText
                        disabled
                        label="创建人"
                        name="creatorName"
                        addonAfter={<Button onClick={() => { window.open(url.frontUrl.humanResource + menu.creator) }}>查看</Button>}
                    />
                </ProFormGroup>

            </ProForm>
        </div>
    )


    let title = menu.isDeprecated ? " 已废弃" : ""
    return (
        <div
            style={{ background: '#F5F7FA' }}
        >
            <PageContainer
                header={{
                    title: menu.contentName + title,
                    breadcrumb: {
                        items: [
                            {
                                title: '展示列表',
                            },
                            {
                                title: menu.contentName,
                            },
                        ],
                    },
                    extra: [
                        <Button key='save' type="primary" onClick={() => { form.submit() }}>{menu.isDeprecated === 0 ? "保存" : "保存并启用"}</Button>,
                        <Button key='reset' onClick={() => { form.resetFields() }}>重置</Button>,
                        <Button key='drop' type='default' danger onClick={dropMenu} disabled={menu.isDeprecated !== 0}>封存</Button>
                    ]
                }}
                tabList={[
                    {
                        key: "base",
                        tab: "基本信息",
                        children: MenuBase
                    }, {
                        key: "childrens",
                        tab: "下级菜单信息",
                        children: <BackMenuList belongContent={menu.dataId} />
                    }, {
                        key: "authority",
                        tab: "共享信息",
                        children: <AuthorityEdit entity={menu} authorityName="shareAuthority" />
                    }
                ]}
            />
        </div>
    )

}

export default BackMenuConcrete